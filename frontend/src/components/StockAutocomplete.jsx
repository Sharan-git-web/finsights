import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Search, Loader2, X } from 'lucide-react';

const StockAutocomplete = forwardRef(({ onSelect, onChange, placeholder = "Search for analysis, stocks, symbols...", initialValue = '', className = '', inline = false, variant = 'dark', clearOnSelect = false, excludeSymbols = [] }, ref) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const abortControllerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        close: () => setIsOpen(false)
    }));

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (onChange) onChange(val);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch results with debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        setActiveIndex(-1);

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.get(`${API_URL}/api/search?q=${query}`, {
                signal: abortControllerRef.current.signal
            });
            // Filter out excluded symbols
            const filteredResults = response.data.filter(item => !excludeSymbols.includes(item.symbol));
            setResults(filteredResults);
            setIsOpen(true);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching stocks:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                handleSelect(results[activeIndex]);
            } else {
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelect = (stock) => {
        if (clearOnSelect) {
            setQuery('');
        } else {
            setQuery(stock.description);
        }
        setResults([]);
        setIsOpen(false);
        if (onSelect) onSelect(stock.symbol, stock);
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={i} className="text-[var(--accent-primary)] font-bold">{part}</span>
                    ) : part
                )}
            </span>
        );
    };

    const isWhite = variant === 'white';

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all placeholder:text-[var(--text-muted)] text-[var(--text-main)]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin text-[var(--accent-primary)]" size={16} />}
                    {query && (
                        <button onClick={() => setQuery('')} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {isOpen && query && (
                <div className={`${inline ? 'relative mt-2 mb-2' : 'absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300'} 
                    ${isWhite ? 'bg-white' : 'bg-[#1e293b]'} 
                    w-full border border-[var(--border-color)] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all`}
                >
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-10 gap-3">
                                <Loader2 className="animate-spin text-[var(--accent-primary)]" size={20} />
                                <span className={`text-sm font-medium ${isWhite ? 'text-slate-400' : 'text-slate-500'}`}>Searching market...</span>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-[var(--border-color)]">
                                {results.map((stock, index) => (
                                    <button
                                        key={stock.symbol}
                                        onClick={() => handleSelect(stock)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`w-full group px-4 py-3.5 text-left flex items-center justify-between transition-all ${index === activeIndex
                                            ? (isWhite ? 'bg-slate-50' : 'bg-slate-700/50')
                                            : 'bg-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isWhite
                                                ? (index === activeIndex ? 'bg-white text-[var(--accent-primary)] shadow-sm' : 'bg-slate-100 text-slate-400')
                                                : (index === activeIndex ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-500')
                                                }`}>
                                                {stock.symbol[0]}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-sm font-bold truncate pr-2 ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                                                    {highlightMatch(stock.description, query)}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isWhite ? 'text-slate-400' : 'text-slate-500'
                                                        }`}>
                                                        {stock.type || 'Stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-xs font-black tracking-tight px-2 py-1 rounded transition-all ${index === activeIndex
                                            ? 'bg-[var(--accent-primary)] text-white'
                                            : (isWhite ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-cyan-400')
                                            }`}>
                                            {stock.symbol}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query && (
                            <div className="py-10 text-center space-y-2">
                                <Search size={22} className="text-[var(--text-muted)] opacity-20 mx-auto" />
                                <p className={`text-xs font-medium ${isWhite ? 'text-slate-400' : 'text-slate-500'}`}>
                                    No matches for "{query}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default StockAutocomplete;
