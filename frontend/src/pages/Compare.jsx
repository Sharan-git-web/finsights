import { useState } from 'react';
import { useComparison } from '../hooks/useComparison';
import ComparisonChart from '../components/ComparisonChart';
import ComparisonTable from '../components/ComparisonTable';
import StockAutocomplete from '../components/StockAutocomplete';
import { Plus, X, Search, TrendingUp, Info } from 'lucide-react';

export default function Compare({ theme }) {
    const [tickers, setTickers] = useState(['AAPL', 'MSFT']);
    const [newTicker, setNewTicker] = useState('');
    const { data, loading, error, compareStocks } = useComparison();

    const handleAddTicker = (e) => {
        e.preventDefault();
        if (!newTicker) return;
        const cleanTicker = newTicker.trim().toUpperCase();
        if (tickers.includes(cleanTicker)) return;
        if (tickers.length >= 6) return;
        setTickers([...tickers, cleanTicker]);
        setNewTicker('');
    };

    const handleRemoveTicker = (ticker) => {
        setTickers(tickers.filter((t) => t !== ticker));
    };

    const handleCompare = () => {
        compareStocks(tickers);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-8 bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight">Active Comparison</label>
                        <span className="text-[10px] bg-[var(--text-muted)]/10 text-[var(--text-muted)] px-2 py-0.5 rounded font-bold">{tickers.length}/6</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {tickers.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] text-[var(--text-main)] rounded-xl border border-[var(--border-color)] group hover:border-[var(--accent-primary)]/50 transition-all shadow-sm"
                            >
                                <span className="font-bold text-sm">{t}</span>
                                <button
                                    onClick={() => handleRemoveTicker(t)}
                                    className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {tickers.length < 6 && (
                            <div className="flex items-center gap-2">
                                <div className="w-64">
                                    <StockAutocomplete
                                        placeholder="Add Ticker..."
                                        variant="white"
                                        className="!py-1"
                                        initialValue={newTicker}
                                        onChange={setNewTicker}
                                        clearOnSelect={true}
                                        excludeSymbols={tickers}
                                        onSelect={(symbol) => {
                                            if (!tickers.includes(symbol)) {
                                                setTickers([...tickers, symbol]);
                                            }
                                            setNewTicker('');
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
                                            setTickers([...tickers, newTicker.toUpperCase()]);
                                            setNewTicker('');
                                        }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--accent-primary)] transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleCompare}
                    disabled={tickers.length < 2 || loading}
                    className="bg-[var(--accent-primary)] hover:brightness-110 disabled:opacity-50 text-white font-bold px-10 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <TrendingUp size={20} />
                    )}
                    {loading ? 'Crunching Numbers' : 'Analyze Comparison'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-medium">
                    <Info size={20} />
                    {error}
                </div>
            )}

            {data && !loading && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <ComparisonChart stocks={data} theme={theme} />
                    <ComparisonTable stocks={data} />
                </div>
            )}

            {!data && !loading && (
                <div className="py-24 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-6 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] border-dashed">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center shadow-inner">
                        <Search size={32} className="opacity-40" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--text-main)]">Ready to compare</p>
                        <p className="text-sm max-w-xs mx-auto mt-2">Select 2-6 tickers above and run the comparison to see real-time performance correlations.</p>
                    </div>
                </div>
            )}

            {loading && (
                <div className="space-y-8 animate-pulse">
                    <div className="h-96 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]" />
                    <div className="h-64 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]" />
                </div>
            )}
        </div>
    );
}
