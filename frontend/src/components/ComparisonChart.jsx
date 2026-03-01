import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { useCurrency } from '../context/CurrencyContext';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ComparisonChart({ stocks, theme }) {
    const { selectedCurrency, getRate } = useCurrency();
    if (!stocks || stocks.length === 0) return null;

    const isDark = theme === 'dark';

    const chartColors = {
        grid: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
        text: isDark ? '#94A3B8' : '#64748B',
        tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
        tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    };

    // Transform data for Recharts: [{ date: '...', AAPL: 100, MSFT: 110 }, ...]
    const dateMap = {};
    stocks.forEach((stock) => {
        stock.price_history_6m.forEach((p) => {
            if (!dateMap[p.date]) {
                dateMap[p.date] = { date: p.date };
            }
            dateMap[p.date][stock.symbol] = p.price;
        });
    });

    const chartData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="w-full h-auto min-h-[500px] bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)]">Performance Correlation</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Relative price movement over the last 6 months</p>
                </div>
            </div>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => {
                                const rate = getRate(selectedCurrency);
                                return `${selectedCurrency} ${(val * rate).toFixed(0)}`;
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: chartColors.tooltipBg,
                                borderColor: chartColors.tooltipBorder,
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            content={({ payload }) => (
                                <div className="flex gap-4 mb-6">
                                    {payload.map((entry, index) => (
                                        <div key={`item-${index}`} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                        {stocks.map((stock, index) => (
                            <Line
                                key={stock.symbol}
                                type="monotone"
                                dataKey={stock.symbol}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
                                animationDuration={1000}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
