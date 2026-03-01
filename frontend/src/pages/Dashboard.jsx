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
    const [timeFilter, setTimeFilter] = useState('1M');
    const [portfolioData, setPortfolioData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pRes, hRes] = await Promise.all([
                    api.get("/portfolio/"),
                    api.get(`/portfolio/history?period=${timeFilter}`)
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
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const StatCard = ({ label, value, subtext, trend, trendValue }) => (
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] transition-all duration-200">
            <p className="text-[13px] font-medium text-[var(--text-muted)] mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{value}</h2>
                {trend && (
                    <span className={`text-xs font-semibold flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}%
                    </span>
                )}
            </div>
            {subtext && <p className="text-[11px] text-[var(--text-muted)] mt-2 opacity-70">{subtext}</p>}
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

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
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-main)]">Portfolio Growth</h3>
                            <p className="text-sm text-[var(--text-muted)]">Historical performance of your assets</p>
                        </div>
                        <div className="flex bg-[var(--bg-primary)] p-1 rounded-md">
                            {['1W', '1M', '1Y', 'ALL'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setTimeFilter(f)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeFilter === f ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                                    width={45}
                                />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--accent-primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorGrowth)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: 'var(--accent-primary)', stroke: 'white', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Portfolio Summary / Alerts */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[var(--text-main)] px-2">Portfolio Summary</h3>

                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 p-4 rounded-xl flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={20} className="text-orange-600 dark:text-orange-400" />
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
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--text-main)]">Holdings</h3>
                    <button className="p-2 hover:bg-[var(--bg-primary)] rounded-md text-[var(--text-muted)]">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--bg-primary)] text-left">
                                <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Allocation</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Current Value</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Gain/Loss</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {portfolioData?.holdings?.map((h) => (
                                <tr key={h.symbol} className="hover:bg-[var(--bg-primary)] transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <p className="text-[13px] font-bold text-[var(--text-main)]">{h.symbol}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-[13px] font-medium text-[var(--text-main)]">{h.allocation}%</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-[13px] font-medium text-[var(--text-main)]">
                                            {formatCurrency(h.value, selectedCurrency, getRate(selectedCurrency), 0)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-[12px] font-bold ${h.pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
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
