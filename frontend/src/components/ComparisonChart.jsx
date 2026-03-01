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
import { useState } from 'react';
import { BarChart3, Coins, Info } from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ComparisonChart({ stocks, theme }) {
    const { selectedCurrency, getRate } = useCurrency();
    const [chartMode, setChartMode] = useState('normalized'); // 'normalized' or 'actual'

    if (!stocks || stocks.length === 0) return null;

    const isDark = theme === 'dark';

    const chartColors = {
        grid: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
        text: isDark ? '#94A3B8' : '#64748B',
        tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
        tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    };

    // Calculate conversion factor to selected currency
    const getConversionFactor = (stockCurrency) => {
        const stockToUSDRate = getRate(stockCurrency);
        const targetToUSDRate = getRate(selectedCurrency);
        // PriceUSD = PriceLocal / stockToUSDRate
        // PriceTarget = PriceUSD * targetToUSDRate
        return targetToUSDRate / stockToUSDRate;
    };

    // Transform data for Recharts
    const dateMap = {};
    const initialPrices = {};

    stocks.forEach((stock) => {
        const history = stock.price_history_6m || [];
        if (history.length > 0) {
            initialPrices[stock.symbol] = history[0].price;
        }
    });

    stocks.forEach((stock) => {
        const history = stock.price_history_6m || [];
        const conversionFactor = getConversionFactor(stock.currency);

        history.forEach((p) => {
            if (!dateMap[p.date]) {
                dateMap[p.date] = { date: p.date };
            }

            if (chartMode === 'normalized') {
                const base = initialPrices[stock.symbol];
                dateMap[p.date][stock.symbol] = base ? ((p.price / base) * 100) : 100;
            } else {
                // Actual mode (Converted)
                dateMap[p.date][stock.symbol] = p.price * conversionFactor;
            }
        });
    });

    const chartData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="w-full h-auto min-h-[550px] bg-[var(--bg-card)] p-4 md:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)]">Performance Correlation</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        {chartMode === 'normalized'
                            ? 'Comparison indexed to 100 at start date (Currency Agnostic)'
                            : `Comparison converted to ${selectedCurrency} using live rates`}
                    </p>
                </div>

                <div className="flex bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-color)] self-stretch md:self-auto">
                    <button
                        onClick={() => setChartMode('normalized')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${chartMode === 'normalized'
                                ? 'bg-[var(--bg-card)] text-[var(--accent-primary)] shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        <BarChart3 size={16} />
                        Normalize (%)
                    </button>
                    <button
                        onClick={() => setChartMode('actual')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${chartMode === 'actual'
                                ? 'bg-[var(--bg-card)] text-[var(--accent-primary)] shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                    >
                        <Coins size={16} />
                        Actual ({selectedCurrency})
                    </button>
                </div>
            </div>

            <div className="h-96 w-full -ml-4 md:ml-0 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: 20, right: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: chartColors.text, fontSize: 10, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={40}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: chartColors.text, fontSize: 10, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            domain={chartMode === 'normalized' ? [80, 'auto'] : ['auto', 'auto']}
                            tickFormatter={(val) => {
                                if (chartMode === 'normalized') return `${val.toFixed(0)}%`;
                                return `${selectedCurrency} ${val > 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0)}`;
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: chartColors.tooltipBg,
                                borderColor: chartColors.tooltipBorder,
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                            formatter={(value, name) => {
                                const stock = stocks.find(s => s.symbol === name);
                                if (chartMode === 'normalized') return [`${value.toFixed(2)}%`, name];
                                return [`${selectedCurrency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            content={({ payload }) => (
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 justify-end">
                                    {payload.map((entry, index) => (
                                        <div key={`item-${index}`} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wider">{entry.value}</span>
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
                                activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length], style: { filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}80)` } }}
                                animationDuration={1000}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-3">
                <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-blue-400 font-medium leading-relaxed">
                    {chartMode === 'normalized'
                        ? "Normalized performance shows the percentage growth of each stock relative to its own starting price (Base = 100). This is the gold standard for comparing the efficiency of different assets regardless of their unit price or currency."
                        : `Actual Price mode converts all historical prices into ${selectedCurrency} using the latest market exchange rates. This helps visualize the actual monetary value of each share in a single currency.`}
                </p>
            </div>
        </div>
    );
}
