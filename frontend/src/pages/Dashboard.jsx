import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

// Mature SaaS colors for allocations (Indigo, Emerald, Amber, Rose, Slate)
// Vibrant FINSIGHTS palette (Purple, Cyan, Fuchsia, Indigo, Slate)
const COLORS = ['#A855F7', '#22D3EE', '#E879F9', '#6366F1', '#475569'];

export default function Dashboard({ theme }) {
    const { selectedCurrency, getRate } = useCurrency();
    const [timeFilter, setTimeFilter] = useState('1W');
    const [portfolioData, setPortfolioData] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    const isDark = theme === 'dark';

    useEffect(() => {
        // Fetch REAL Portfolio Summary via JWT
        api.get("/portfolio/")
            .then(res => {
                const data = res.data;
                // Group by base ticker to merge duplicates (like MSFT and MSFT.L)
                const allocationMap = {};
                data.assets?.forEach(asset => {
                    const baseSymbol = asset.symbol.split('.')[0]; // e.g., INFY.NS -> INFY
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
                // Fallback to empty state
                setPortfolioData({
                    portfolioValue: 0,
                    totalPL: 0,
                    holdingsCount: 0,
                    allocations: []
                });
            });
    }, []);

    useEffect(() => {
        // Fetch Historical Portfolio Chart Data based on timeFilter
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

    // Calculate real percent changes
    const initialValue = portfolioData.portfolioValue - portfolioData.totalPL;
    const portfolioReturn = initialValue > 0
        ? ((portfolioData.totalPL / initialValue) * 100).toFixed(2)
        : 0;

    const isPositiveReal = portfolioData.totalPL >= 0;

    // Enhance allocations with colors
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
        <div className="max-w-[1600px] mx-auto space-y-6 pb-10 flex flex-col items-stretch transition-colors duration-300">
            {/* SECTION 1: AI Insight Panel */}
            <div className="relative overflow-hidden rounded-[32px] p-8 flex flex-col md:flex-row items-start md:items-center gap-8 border border-white/10 dark:border-white/10 shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl group transition-all duration-500 hover:shadow-purple-500/10 hover:border-purple-500/20">
                {/* Soft ambient gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

                <div className="relative flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-4 rounded-2xl border border-purple-500/30 relative group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/20">
                        <Sparkles size={28} className="text-purple-500 animate-pulse" />
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                </div>

                <div className="flex-1 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">FINSIGHTS <span className="text-purple-500">PROACTIVE ANALYSIS</span></h3>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] hidden sm:inline-block">Neural Engine Core</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[16px] leading-relaxed max-w-4xl font-medium">
                        Your largest holding makes up <strong className="text-[var(--text-main)] font-black">{allocationsWithColors[0]?.value || 0}%</strong> of your portfolio. Finsights detects a higher sector concentration risk than your target 65/100 profile. We suggest rebalancing <strong className="text-purple-500">8.4%</strong> into diversified global equity to stabilize your alpha.
                    </p>
                </div>

                <button className="relative z-10 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 whitespace-nowrap">
                    Apply Strategy
                </button>
            </div>

            {/* SECTION 2: KPI Grid (4 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* KPI 1: Total Portfolio */}
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
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

                {/* KPI 2: Total P/L */}
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
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

                {/* KPI 3: Active Holdings */}
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                    <p className="text-[var(--text-muted)] text-[11px] font-semibold uppercase tracking-wider mb-2">Active Holdings</p>
                    <div className="flex items-baseline space-x-2 relative z-10">
                        <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{portfolioData.holdingsCount}</h2>
                        <span className="text-xs font-medium text-[var(--text-muted)]">Assets</span>
                    </div>
                </div>

                {/* KPI 4: Risk Score */}
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <p className="text-[var(--text-muted)] text-[11px] font-semibold uppercase tracking-wider">Risk Profile</p>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3 relative z-10">
                        <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">65</h2>
                        <span className="text-sm font-medium text-[var(--text-muted)]">Moderate</span>
                    </div>
                    <div className="w-full bg-[var(--border-color)]/50 rounded-full h-1 mt-2 overflow-hidden relative z-10">
                        <div className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-1000 relative" style={{ width: '65%' }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-amber-500 rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* SECTION 3: Charts Area (70/30 Split) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Large Performance Chart (70%) */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 flex flex-col group relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--text-main)] tracking-tight">Growth Analysis</h3>
                            <p className="text-[13px] font-medium text-[var(--text-muted)] mt-0.5">Historical performance of combined assets</p>
                        </div>
                        <div className="flex bg-[var(--bg-primary)] p-1 rounded-full border border-[var(--border-color)]/50">
                            {['1D', '1W', '1M', '1Y'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-300 ${timeFilter === filter
                                        ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[350px] w-full relative z-10 flex items-center justify-center">
                        {historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="var(--bg-card)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} opacity={0.4} />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }}
                                        tickFormatter={(val) => {
                                            const rate = getRate(selectedCurrency);
                                            const converted = (val * rate / 1000).toFixed(1);
                                            return `${selectedCurrency} ${converted}k`;
                                        }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: chartColors.tooltipBg,
                                            borderColor: chartColors.tooltipBorder,
                                            borderRadius: '16px',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                            border: '1px solid var(--border-color)',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            padding: '12px 16px'
                                        }}
                                        itemStyle={{ color: 'var(--accent-primary)', fontWeight: '900' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--accent-primary)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--accent-primary)', style: { filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.8))' } }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                <Sparkles className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                                <p className="text-sm font-bold text-[var(--text-muted)]">Building performance curve...</p>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[var(--text-muted)]">Historical Data Unavailable</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart (30%) */}
                <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 flex flex-col group relative">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-semibold text-[var(--text-main)] tracking-tight">Distribution</h3>
                        <button className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-muted)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                            <Filter size={16} />
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center items-center min-h-[260px] relative z-10">
                        {allocationsWithColors.length > 0 ? (
                            <div className="w-full h-[260px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocationsWithColors}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={105}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={8}
                                        >
                                            {allocationsWithColors.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 4px 6px ${entry.color}40)` }} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: chartColors.tooltipBg,
                                                borderColor: chartColors.tooltipBorder,
                                                borderRadius: '16px',
                                                border: '1px solid var(--border-color)',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }}
                                            itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Total Value</span>
                                    <span className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{formatCurrency(portfolioData.portfolioValue, selectedCurrency, getRate(selectedCurrency)).split('.')[0]}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[var(--text-muted)] font-bold text-sm bg-[var(--bg-primary)] px-4 py-2 rounded-xl">No data available</div>
                        )}
                    </div>

                    {/* Custom Legend */}
                    <div className="mt-8 space-y-3 relative z-10">
                        {allocationsWithColors.slice(0, 5).map((item) => (
                            <div key={item.name} className="flex items-center justify-between group/item cursor-default py-1">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full transition-transform group-hover/item:scale-125" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[13px] text-[var(--text-muted)] group-hover/item:text-[var(--text-main)] transition-colors font-medium">{item.name}</span>
                                </div>
                                <span className="text-[13px] font-semibold text-[var(--text-main)] group-hover/item:text-[var(--accent-primary)] transition-colors">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}