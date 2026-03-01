import {
    LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Dashboard() {
    const { selectedCurrency, getRate } = useCurrency();
    const [portfolioData, setPortfolioData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [signupDate, setSignupDate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pRes, hRes] = await Promise.all([
                    api.get("/portfolio/"),
                    api.get("/portfolio/history")
                ]);

                const data = pRes.data;
                const assets = data.assets || [];

                // Process for table
                const holdings = assets.map(asset => ({
                    symbol: asset.symbol.split('.')[0],
                    allocation: asset.allocation,
                    value: asset.value,
                    pl: asset.pnl || 0,
                    plPercent: asset.pnlPercentage || 0
                })).sort((a, b) => b.allocation - a.allocation);

                setPortfolioData({
                    totalValue: data.totalValue,
                    totalPL: data.totalPnL,
                    plPercent: data.totalPnLPercentage || 0,
                    holdings: holdings,
                    riskScore: 65, // Mocked for now as requested
                    topAllocation: holdings[0]?.allocation || 0
                });
                setHistoryData(hRes.data.history || []);
                setSignupDate(hRes.data.signupDate);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Growth calculation logic
    const calculateGrowth = () => {
        if (!historyData || historyData.length < 2) return 0;
        const first = historyData[0].value;
        const last = historyData[historyData.length - 1].value;
        if (first === 0) return 0;
        return ((last - first) / first) * 100;
    };

    const growthPercent = calculateGrowth();
    const formattedSignupDate = signupDate ? new Date(signupDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const StatCard = ({ label, value, subtext, trend, trendValue }) => (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] transition-all duration-200 hover:border-[var(--accent-primary)]/30 group">
            <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{value}</h2>
                {trend && (
                    <span className={`text-[13px] font-bold flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}%
                    </span>
                )}
            </div>
            {subtext && <p className="text-[11px] text-[var(--text-muted)] mt-4 font-medium opacity-80">{subtext}</p>}
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-10">

            {/* Top Section: Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Portfolio Value"
                    value={formatCurrency(portfolioData?.totalValue, selectedCurrency, getRate(selectedCurrency))}
                    subtext="Last updated 2 mins ago"
                />
                <StatCard
                    label="Total Gain/Loss"
                    value={formatCurrency(Math.abs(portfolioData?.totalPL), selectedCurrency, getRate(selectedCurrency))}
                    trend={portfolioData?.totalPL >= 0 ? 'up' : 'down'}
                    trendValue={portfolioData?.plPercent}
                />
                <StatCard
                    label="Risk Score"
                    value={`${portfolioData?.riskScore}/100`}
                    subtext={portfolioData?.riskScore > 70 ? "High Risk" : portfolioData?.riskScore > 40 ? "Moderate" : "Low Risk"}
                />
                <StatCard
                    label="Main Allocation"
                    value={`${portfolioData?.topAllocation}%`}
                    subtext={portfolioData?.holdings?.[0]?.symbol || "N/A"}
                />
            </div>

            {/* Middle Section: Chart and Portfolio Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Portfolio Growth</h3>
                            <p className="text-xl font-bold text-[var(--text-main)]">Since {formattedSignupDate}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-2xl font-bold ${growthPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
                            </p>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">Total Performance</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        {historyData.length < 2 ? (
                            <div className="h-full w-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-color)]">
                                    <TrendingUp size={20} className="text-[var(--text-muted)] opacity-50" />
                                </div>
                                <div>
                                    <p className="text-[var(--text-main)] font-bold text-sm tracking-tight text-muji leading-relaxed">Tracking started today.</p>
                                    <p className="text-[var(--text-muted)] text-[11px] mt-1">Growth data will appear soon as markets move.</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.2} />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 600 }}
                                        dy={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 600 }}
                                        tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                                        width={40}
                                    />
                                    <RechartsTooltip
                                        cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-card)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                            padding: '8px 12px'
                                        }}
                                        itemStyle={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: 'bold' }}
                                        labelStyle={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                        formatter={(value) => [formatCurrency(value, selectedCurrency, getRate(selectedCurrency), 0), 'Value']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--accent-primary)"
                                        strokeWidth={1.5}
                                        dot={false}
                                        activeDot={{ r: 4, fill: 'var(--accent-primary)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Portfolio Summary / Alerts */}
                <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2">Portfolio Summary</h3>

                    <div className="bg-[var(--bg-card)] border-l-2 border-orange-500/50 p-5 rounded-r-xl border-y border-r border-[var(--border-color)] flex gap-4 transition-all hover:bg-[var(--bg-primary)]/40">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={16} className="text-orange-500/80" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-orange-900 dark:text-orange-100">Portfolio is concentrated</p>
                            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">47% in one stock. Suggest rebalancing ₹1,60,000 to reduce risk.</p>
                            <button className="text-[11px] font-bold text-orange-600 dark:text-orange-400 mt-3 flex items-center gap-1 hover:underline">
                                View Plan <ArrowUpRight size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-xl flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-indigo-900 dark:text-indigo-100">Stability at 65%</p>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Your current allocation aligns with a moderate growth strategy.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Holdings Table */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest">Asset Allocation</h3>
                    <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-muted)] transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--bg-primary)]/50 text-left">
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Stock Asset</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] text-right">Allocation</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] text-right">Value</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {portfolioData?.holdings?.map((h) => (
                                <tr key={h.symbol} className="hover:bg-[var(--bg-primary)]/30 transition-all cursor-pointer group">
                                    <td className="px-8 py-5">
                                        <p className="text-[14px] font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">{h.symbol}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <p className="text-[14px] font-medium text-[var(--text-main)]">{h.allocation}%</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <p className="text-[14px] font-medium text-[var(--text-main)]">
                                            {formatCurrency(h.value, selectedCurrency, getRate(selectedCurrency), 0)}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`text-[13px] font-bold ${h.pl >= 0 ? 'text-emerald-500/90' : 'text-rose-500/90'}`}>
                                            {h.pl >= 0 ? '+' : ''}{h.plPercent}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
