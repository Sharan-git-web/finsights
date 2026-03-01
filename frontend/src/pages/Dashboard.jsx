import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, ShieldAlert, Sparkles, Filter, Zap, Activity, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const COLORS = ['#A855F7', '#22D3EE', '#E879F9', '#6366F1', '#475569'];

export default function Dashboard({ theme }) {
    const { selectedCurrency, getRate } = useCurrency();
    const [timeFilter, setTimeFilter] = useState('1W');
    const [portfolioData, setPortfolioData] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    const isDark = theme === 'dark';

    useEffect(() => {
        api.get("/portfolio/")
            .then(res => {
                const data = res.data;
                const allocationMap = {};
                data.assets?.forEach(asset => {
                    const baseSymbol = asset.symbol.split('.')[0];
                    if (allocationMap[baseSymbol]) {
                        allocationMap[baseSymbol] += asset.allocation;
                    } else {
                        allocationMap[baseSymbol] = asset.allocation;
                    }
                });

                const aggregatedAllocations = Object.keys(allocationMap).map(symbol => ({
                    name: symbol,
                    value: Number(allocationMap[symbol].toFixed(1))
                })).sort((a, b) => b.value - a.value);

                setPortfolioData({
                    portfolioValue: data.totalValue,
                    totalPL: data.totalPnL,
                    holdingsCount: Object.keys(allocationMap).length || 0,
                    allocations: aggregatedAllocations
                });
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setPortfolioData({
                    portfolioValue: 0,
                    totalPL: 0,
                    holdingsCount: 0,
                    allocations: []
                });
            });
    }, []);

    useEffect(() => {
        api.get(`/portfolio/history?period=${timeFilter}`)
            .then(res => {
                setHistoryData(res.data.history || []);
            })
            .catch(err => {
                console.error("Dashboard history fetch error:", err);
                setHistoryData([]);
            });
    }, [timeFilter]);

    if (!portfolioData) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-[var(--text-muted)] font-bold tracking-tight">Gathering market data...</p>
            </div>
        );
    }

    const initialValue = portfolioData.portfolioValue - portfolioData.totalPL;
    const portfolioReturn = initialValue > 0
        ? ((portfolioData.totalPL / initialValue) * 100).toFixed(2)
        : 0;

    const isPositiveReal = portfolioData.totalPL >= 0;

    const allocationsWithColors = (portfolioData.allocations || []).map((alloc, idx) => ({
        ...alloc,
        color: COLORS[idx % COLORS.length]
    }));

    const chartColors = {
        grid: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
        text: isDark ? '#94A3B8' : '#64748B',
        tooltipBg: isDark ? '#020617' : '#FFFFFF',
        tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-24 md:pb-10 flex flex-col items-stretch transition-colors duration-300">
            
            {/* MOBILE ONLY: The "Player Level" Header */}
            <div className="md:hidden flex flex-col items-center justify-center pt-8 pb-4 relative z-10 animate-[idle-float_6s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full w-48 h-48 mx-auto pointer-events-none"></div>
                <div className="flex items-center space-x-2 bg-slate-900/80 border border-purple-500/30 px-4 py-1.5 rounded-full mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-black text-purple-100 uppercase tracking-widest">Level 12 • Core Matrix</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {formatCurrency(portfolioData.portfolioValue, selectedCurrency, getRate(selectedCurrency)).split('.')[0]}
                </h1>
                <p className={`text-sm font-bold flex items-center mt-2 ${isPositiveReal ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}>
                    {isPositiveReal ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    {isPositiveReal ? '+' : '-'}{formatCurrency(Math.abs(portfolioData.totalPL), selectedCurrency, getRate(selectedCurrency))} ({isPositiveReal ? '+' : ''}{portfolioReturn}%)
                </p>
            </div>

            {/* SECTION 1: AI Insight Panel */}
            <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 border border-purple-500/20 md:border-white/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)] md:shadow-2xl bg-slate-900/80 md:bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl group transition-all duration-500 hover:shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

                <div className="relative flex-shrink-0 animate-[pulse-glow_3s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                    <div className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-4 rounded-2xl border border-purple-500/50 relative group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/20">
                        <Sparkles size={28} className="text-purple-300 md:text-purple-500 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        <Sparkles size={28} className="text-purple-300 md:text-purple-500 absolute top-4 left-4" />
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    </div>
                </div>

                <div className="flex-1 relative z-10 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="text-xl md:text-xl font-black text-white md:text-[var(--text-main)] tracking-tight">FINSIGHTS <span className="text-purple-400 md:text-purple-500">PROACTIVE ANALYSIS</span></h3>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 md:bg-purple-500/10 md:text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] inline-block w-max max-w-full">Neural Engine</span>
                    </div>
                    <p className="text-slate-300 md:text-[var(--text-muted)] text-[14px] md:text-[16px] leading-relaxed w-full font-medium">
                        Your largest holding makes up <strong className="text-white md:text-[var(--text-main)] font-black">{allocationsWithColors[0]?.value || 0}%</strong> of your portfolio. Finsights detects a higher sector concentration risk than your target 65/100 profile. We suggest rebalancing <strong className="text-purple-400 md:text-purple-500">8.4%</strong> into diversified global equity to stabilize your alpha.
                    </p>
                </div>

                <button className="w-full md:w-auto mt-4 md:mt-0 relative z-10 px-6 py-4 md:py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl md:rounded-xl text-sm font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-95 whitespace-nowrap">
                    Engage Upgrade
                </button>
            </div>

            {/* SECTION 2: KPI Grid (4 Columns) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                {/* KPI 1: Desktop Only Total */}
                <div className="hidden md:block bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group col-span-2 md:col-span-1">
                    <p className="text-[var(--text-muted)] text-[11px] font-semibold uppercase tracking-wider mb-2">Total Portfolio Value</p>
                    <div className="flex items-end justify-between relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{formatCurrency(portfolioData.portfolioValue, selectedCurrency, getRate(selectedCurrency))}</h2>
                        </div>
                        <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }]}>
                                    <Line type="monotone" dataKey="v" stroke="var(--accent-primary)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* KPI 2: Mobile Output Rate / Desktop P/L */}
                <div className="md:hidden bg-slate-900/60 p-4 rounded-[20px] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-cyan-400/80 text-[9px] font-black uppercase tracking-widest flex items-center">
                            <Activity size={10} className="mr-1" /> Yield
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400/50">/ 24h</span>
                    </div>
                    <div className="flex items-baseline gap-1 relative z-10 mt-1">
                        <h2 className="text-xl font-black text-cyan-300 tracking-tight drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
                            {formatCurrency(Math.abs(portfolioData.totalPL / 30), selectedCurrency, getRate(selectedCurrency), 0)}
                        </h2>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden relative z-10">
                        <div className="bg-cyan-400 h-full rounded-full animate-pulse" style={{ width: '85%' }}></div>
                    </div>
                </div>

                <div className="hidden md:block bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                    <p className="text-[var(--text-muted)] text-[11px] font-semibold uppercase tracking-wider mb-2">Unrealized P/L</p>
                    <div className="flex items-baseline gap-3 relative z-10">
                        <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
                            {isPositiveReal ? '+' : '-'}{formatCurrency(Math.abs(portfolioData.totalPL), selectedCurrency, getRate(selectedCurrency))}
                        </h2>
                        <div className={`flex items-center text-xs font-bold transition-colors duration-300 ${isPositiveReal ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isPositiveReal ? <TrendingUp size={14} className="mr-0.5 stroke-[3]" /> : <TrendingDown size={14} className="mr-0.5 stroke-[3]" />}
                            {Math.abs(portfolioReturn)}%
                        </div>
                    </div>
                </div>

                {/* KPI 3: Modules Online */}
                <div className="bg-slate-900/60 md:bg-[var(--bg-card)] p-4 md:p-6 rounded-[20px] md:rounded-2xl border border-fuchsia-500/20 md:border-[var(--border-color)] shadow-[0_0_15px_rgba(232,121,249,0.05)] md:shadow-[0_2px_10px_rgb(0,0,0,0.02)] md:hover:-translate-y-1 md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                    <p className="text-fuchsia-400/80 md:text-[var(--text-muted)] text-[9px] md:text-[11px] font-black md:font-semibold uppercase tracking-widest md:tracking-wider mb-1 flex items-center">
                        <Zap size={10} className="mr-1 md:hidden" /> {portfolioData.holdingsCount > 0 ? 'Modules' : 'Holdings'}
                    </p>
                    <div className="flex items-baseline space-x-1 relative z-10 mt-1">
                        <h2 className="text-xl md:text-3xl font-black md:font-bold text-fuchsia-300 md:text-[var(--text-main)] tracking-tight drop-shadow-[0_0_5px_rgba(232,121,249,0.4)] md:drop-shadow-none">{portfolioData.holdingsCount}</h2>
                        <span className="text-[10px] font-bold md:font-medium text-fuchsia-500/80 md:text-[var(--text-muted)] uppercase md:capitalize">Assets</span>
                    </div>
                    <div className="w-full bg-slate-800 md:hidden rounded-full h-1 mt-2 overflow-hidden relative z-10">
                        <div className="bg-fuchsia-400 h-full rounded-full animate-pulse" style={{ width: '40%' }}></div>
                    </div>
                </div>

                {/* KPI 4: Shield / Risk */}
                <div className="col-span-2 lg:col-span-1 bg-slate-900/60 md:bg-[var(--bg-card)] p-5 md:p-6 rounded-[20px] md:rounded-2xl border border-emerald-500/20 md:border-[var(--border-color)] shadow-[0_0_15px_rgba(16,185,129,0.05)] md:shadow-[0_2px_10px_rgb(0,0,0,0.02)] md:hover:-translate-y-1 md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                    <p className="text-emerald-400/80 md:text-[var(--text-muted)] text-[10px] md:text-[11px] font-black md:font-semibold uppercase tracking-widest md:tracking-wider mb-2 flex items-center">
                        <ShieldAlert size={12} className="mr-1.5 md:hidden" /> {isDark || true ? 'Shield Integrity' : 'Risk Profile'}
                    </p>
                    <div className="flex items-baseline gap-2 mb-2 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black md:font-bold text-emerald-300 md:text-[var(--text-main)] tracking-tight drop-shadow-[0_0_5px_rgba(16,185,129,0.4)] md:drop-shadow-none">65%</h2>
                        <span className="text-xs font-bold md:font-medium text-emerald-500/80 md:text-[var(--text-muted)] uppercase md:capitalize">Stable</span>
                    </div>
                    <div className="w-full bg-slate-800 md:bg-[var(--border-color)]/50 rounded-full h-1.5 md:h-1 mt-1 overflow-hidden relative z-10">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 md:via-amber-400 md:to-rose-500 h-full rounded-full transition-all duration-1000 relative" style={{ width: '65%' }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white md:bg-white border border-emerald-500 md:border-amber-500 rounded-full xl:shadow-[0_0_8px_rgba(255,255,255,0.8)] shadow-[0_0_8px_rgba(16,185,129,0.8)] md:shadow-sm"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* SECTION 3: Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Large Performance Chart (70%) */}
                <div className="lg:col-span-2 bg-slate-900/40 md:bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 rounded-[24px] md:rounded-2xl border border-purple-500/10 md:border-[var(--border-color)] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] md:shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-500 flex flex-col group relative overflow-hidden">
                    <div className="flex flex-row justify-between items-center mb-6 md:mb-8 relative z-10 gap-x-2">
                        <div>
                            <h3 className="text-lg md:text-xl font-black md:font-semibold text-white md:text-[var(--text-main)] tracking-tight uppercase md:capitalize">Energy Wave</h3>
                            <p className="text-[10px] md:text-[13px] font-bold md:font-medium text-purple-300/60 md:text-[var(--text-muted)] mt-0.5 uppercase md:capitalize tracking-widest md:tracking-normal truncate max-w-[150px] md:max-w-none">Signal resonance over time</p>
                        </div>
                        <div className="flex bg-slate-800/80 md:bg-[var(--bg-primary)] p-1 rounded-full border border-purple-500/20 md:border-[var(--border-color)]/50 backdrop-blur-md overflow-x-auto no-scrollbar">
                            {['1D', '1W', '1M', '1Y'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-3 md:px-4 py-1.5 text-[11px] md:text-[13px] font-black md:font-semibold rounded-full transition-all duration-300 ${timeFilter === filter
                                        ? 'bg-purple-600/80 text-white md:bg-[var(--bg-card)] md:text-[var(--text-main)] shadow-[0_0_10px_rgba(168,85,247,0.5)] md:shadow-sm'
                                        : 'text-slate-400 hover:text-white md:text-[var(--text-muted)] md:hover:text-[var(--text-main)]'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[200px] md:min-h-[350px] w-full relative z-10 flex items-center justify-center -mx-4 md:mx-0 w-[calc(100%+32px)] md:w-full">
                        {historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValueM" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D946EF" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} opacity={isDark ? 0.05 : 0.4} className="hidden md:block" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : chartColors.text, fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                        className="hidden md:block"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : chartColors.text, fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(val) => {
                                            const rate = getRate(selectedCurrency);
                                            const converted = (val * rate / 1000).toFixed(1);
                                            return `${selectedCurrency} ${converted}k`;
                                        }}
                                        className="hidden md:block"
                                        width={60}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: '#0F172A',
                                            borderColor: 'rgba(168,85,247,0.3)',
                                            borderRadius: '16px',
                                            boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                                            border: '1px solid rgba(168,85,247,0.3)',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            padding: '12px 16px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#E879F9', fontWeight: '900' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#D946EF"  // Fuchsia 500
                                        strokeWidth={isDark ? 3 : 4}
                                        fillOpacity={1}
                                        fill="url(#colorValueM)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#F0ABFC', style: { filter: 'drop-shadow(0 0 10px rgba(240,171,252,1))' } }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                <Sparkles className="w-8 h-8 text-[var(--text-muted)] mb-2 animate-pulse" />
                                <p className="text-sm font-bold text-[var(--text-muted)]">Calibrating sensors...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart (30%) - Reactor Core */}
                <div className="bg-slate-900/40 md:bg-[var(--bg-card)] p-6 sm:p-8 rounded-[24px] md:rounded-2xl border border-cyan-500/10 md:border-[var(--border-color)] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] md:shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-500 flex flex-col group relative">
                    <div className="flex justify-between items-center mb-0 md:mb-6 relative z-10 gap-2">
                        <h3 className="text-lg md:text-xl font-black md:font-semibold text-white md:text-[var(--text-main)] tracking-tight uppercase md:capitalize truncate">Core Elements</h3>
                        <button className="flex-shrink-0 p-2 rounded-xl bg-slate-800/80 md:bg-transparent md:hover:bg-[var(--bg-primary)] text-cyan-400 md:text-[var(--text-muted)] transition-colors border border-cyan-500/20 md:border-transparent md:hover:border-[var(--border-color)]">
                            <Filter size={14} />
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center flex-col md:flex-row md:items-center min-h-[160px] md:min-h-[260px] relative z-10 w-full overflow-hidden">
                        {allocationsWithColors.length > 0 ? (
                            <div className="w-full flex justify-center -my-8 md:my-0 lg:h-[260px] relative animate-[idle-float_8s_ease-in-out_infinite] scale-[0.6] md:scale-100 h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocationsWithColors}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={isDark ? 65 : 80}
                                            outerRadius={isDark ? 90 : 105}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={12}
                                        >
                                            {allocationsWithColors.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: isDark ? `drop-shadow(0 0 12px ${entry.color}80)` : `drop-shadow(0 4px 6px ${entry.color}40)` }} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: '#0F172A',
                                                borderColor: 'rgba(34,211,238,0.3)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(34,211,238,0.3)',
                                                boxShadow: '0 0 20px rgba(34,211,238,0.2)',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="w-24 h-24 rounded-full bg-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Capacity</span>
                                        <span className="text-xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">100%</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[var(--text-muted)] font-bold text-sm bg-[var(--bg-primary)] px-4 py-2 rounded-xl mt-4 max-w-max mx-auto">No active elements</div>
                        )}
                        
                        {/* Custom Legend for Mobile */}
                        <div className="mt-0 md:mt-8 space-y-2 md:space-y-3 relative z-10 w-full grid grid-cols-2 gap-x-2 gap-y-2 md:grid-cols-1 md:gap-x-0 md:hidden pb-4">
                            {allocationsWithColors.slice(0, 4).map((item) => (
                                <div key={item.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between group/item cursor-default py-2 md:py-1 px-3 md:px-0 bg-slate-900/80 md:bg-transparent rounded-xl border border-slate-800/80 md:border-none shadow-[inset_0_0_10px_rgba(168,85,247,0.05)]">
                                    <div className="flex items-center space-x-2 truncate mb-1 sm:mb-0">
                                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] transition-transform group-hover/item:scale-125 flex-shrink-0" style={{ backgroundColor: item.color, color: item.color }}></div>
                                        <span className="text-[11px] text-slate-300 md:text-[var(--text-muted)] group-hover/item:text-white md:group-hover/item:text-[var(--text-main)] transition-colors font-bold truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[12px] font-black text-white md:text-[var(--text-main)] group-hover/item:text-[var(--accent-primary)] transition-colors sm:text-right">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Legend for Desktop */}
                    <div className="hidden md:block mt-8 space-y-3 relative z-10">
                        {allocationsWithColors.slice(0, 5).map((item) => (
                            <div key={item.name} className="flex items-center justify-between group/item cursor-default py-1">
                                <div className="flex items-center space-x-3 truncate mr-4">
                                    <div className="w-2.5 h-2.5 rounded-full transition-transform group-hover/item:scale-125 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[13px] text-[var(--text-muted)] group-hover/item:text-[var(--text-main)] transition-colors font-medium truncate">{item.name}</span>
                                </div>
                                <span className="text-[13px] font-semibold text-[var(--text-main)] overflow-visible group-hover/item:text-[var(--accent-primary)] transition-colors whitespace-nowrap">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
