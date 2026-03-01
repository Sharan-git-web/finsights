import { Bell, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme, onStockSelect }) {
    const { selectedCurrency, setSelectedCurrency, supportedCurrencies } = useCurrency();
    const { user, signOut } = useAuth();

    // Get initials from user name or email
    const getInitials = () => {
        if (!user) return '??';
        const name = user.user_metadata?.full_name || user.email;
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getUserName = () => {
        if (!user) return 'Guest';
        return user.user_metadata?.full_name || user.email.split('@')[0];
    };

    return (
        <nav className="h-20 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-8 flex items-center justify-between transition-colors duration-300 shadow-sm sticky top-0 z-50">
            <div className="flex-1 max-w-xl">
                {/* Search bar removed */}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group/currency">
                    <button
                        className="px-4 py-2.5 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 font-bold shadow-sm shadow-[var(--border-color)] flex items-center gap-2"
                        aria-label="Select currency"
                    >
                        <Globe size={18} />
                        <span className="text-sm uppercase tracking-wide">{selectedCurrency}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl opacity-0 invisible group-hover/currency:opacity-100 group-hover/currency:visible transition-all duration-300 z-50 overflow-hidden backdrop-blur-xl">
                        <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {supportedCurrencies.map((currency) => (
                                <button
                                    key={currency.code}
                                    onClick={() => setSelectedCurrency(currency.code)}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-primary)] transition-colors flex items-center justify-between ${selectedCurrency === currency.code ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-black' : 'text-[var(--text-main)] font-medium'}`}
                                >
                                    <span>{currency.name}</span>
                                    <span className="text-[var(--text-muted)] text-[10px] font-black">{currency.code}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-8 w-px bg-[var(--border-color)] mx-1"></div>

                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    aria-label="Toggle theme"
                >
                    <div className="flex items-center justify-center transition-transform duration-500 transform active:rotate-180">
                        {theme === 'light' ? (
                            <Moon size={20} className="animate-in fade-in zoom-in spin-in-90 duration-300" />
                        ) : (
                            <Sun size={20} className="animate-in fade-in zoom-in spin-in-90 duration-300" />
                        )}
                    </div>
                </button>

                <button className="relative p-3 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:text-[var(--text-main)] group">
                    <Bell size={20} className="group-hover:animate-wiggle" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-primary)] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                </button>

                <div className="h-8 w-px bg-[var(--border-color)] mx-1"></div>

                <div className="relative group/profile">
                    <div className="flex items-center gap-3 pl-2 cursor-pointer group hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[var(--text-main)] truncate max-w-[150px]">
                                {getUserName()}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest font-black text-[var(--accent-primary)] mt-0.5">Premium Tier</p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                            {getInitials()}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50 overflow-hidden backdrop-blur-xl">
                        <div className="py-2">
                            <button
                                onClick={signOut}
                                className="w-full px-4 py-3 text-left text-sm hover:bg-rose-500/10 hover:text-rose-500 text-[var(--text-main)] font-black transition-colors flex items-center gap-3 group/btn"
                            >
                                <LogOut size={16} className="text-[var(--text-muted)] group-hover/btn:text-rose-500 transition-colors" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
