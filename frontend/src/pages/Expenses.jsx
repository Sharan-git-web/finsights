import { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Trash2,
    CreditCard,
    PieChart as PieChartIcon,
    List,
    IndianRupee,
    Loader2,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ChevronDown
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Input, Select } from './modules/shared';

const CATEGORIES = [
    "Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Transport", "EMI", "Subscriptions", "Other"
];

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', '#64748B'];

export default function Expenses({ theme }) {
    const { selectedCurrency, getRate } = useCurrency();
    const currentRate = getRate(selectedCurrency);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);

    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [isAdding, setIsAdding] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { user } = useAuth();

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/expenses/');
            setExpenses(res.data);
            setError(null);
        } catch (err) {
            console.error("Fetch expenses error:", err);
            setError("Failed to fetch expenses. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchExpenses();
        }
    }, [user]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!description || !amount || Number(amount) <= 0) return;

        setIsAdding(true);
        try {
            await api.post('/expenses/', {
                description,
                amount: Number(amount) / currentRate,
                category,
                user_id: user.id
            });
            setDescription('');
            setAmount('');
            setCategory(CATEGORIES[0]);
            setSuccessMessage('Expense added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            await fetchExpenses();
        } catch (err) {
            console.error("Add expense error:", err);
            alert("Failed to add expense.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        setIsDeleting(id);
        try {
            await api.delete(`/expenses/${id}`);
            await fetchExpenses();
        } catch (err) {
            console.error("Delete expense error:", err);
            alert("Failed to delete expense.");
        } finally {
            setIsDeleting(null);
        }
    };

    const totalSpent = useMemo(() => {
        return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, [expenses]);

    const chartData = useMemo(() => {
        const distribution = {};
        expenses.forEach(exp => {
            distribution[exp.category] = (distribution[exp.category] || 0) + exp.amount;
        });
        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    if (isLoading && expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
                <Loader2 className="w-12 h-12 text-[var(--accent-primary)] animate-spin" />
                <p className="text-[var(--text-muted)] font-medium">Loading your expenses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Expense Dashboard</h1>
                <p className="text-[var(--text-muted)] font-medium flex items-center gap-2">
                    <CreditCard size={18} className="text-[var(--accent-primary)]" />
                    Track and manage your spending with persistent storage
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form and KPI */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Add Expense Card */}
                    <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-8">
                        <h2 className="text-xl font-black text-[var(--text-main)] flex items-center gap-3">
                            <Plus size={24} className="text-[var(--accent-primary)]" />
                            Add Expense
                        </h2>
                        <form onSubmit={handleAddExpense} className="space-y-5">
                            <Input
                                label="Description"
                                type="text"
                                value={description}
                                onChange={setDescription}
                                placeholder="e.g. Weekly Groceries"
                                required
                            />
                            <div className="grid grid-cols-2 gap-5">
                                <Input
                                    label={`Amount (${selectedCurrency})`}
                                    type="number"
                                    value={amount}
                                    onChange={setAmount}
                                    placeholder="0.00"
                                    required
                                    prefix={<IndianRupee size={16} className="text-slate-400" />}
                                />
                                <Select
                                    label="Category"
                                    value={category}
                                    onChange={setCategory}
                                    options={CATEGORIES}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="w-full bg-[var(--accent-primary)] text-white font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent-primary)]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                {isAdding ? 'Adding...' : 'Add Expense'}
                            </button>
                            {successMessage && (
                                <p className="text-emerald-500 text-center font-bold text-sm animate-bounce">
                                    {successMessage}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Total Spent Card */}
                    <div className="bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-indigo-500/30 transition-all duration-300">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -ml-16 -mb-16 blur-2xl" />

                        {/* Glass Overlay Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                                        <CreditCard size={26} className="text-white" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/10">
                                            <TrendingUp size={12} className="text-emerald-400" />
                                            <span>Target: ₹80k</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.25em] mb-2 ml-1">Total Monthly Spend</p>
                                <h2 className="text-6xl font-black mb-2 tracking-tighter flex items-center gap-1.5 drop-shadow-sm">
                                    {formatCurrency(totalSpent, selectedCurrency, currentRate).split('.')[0]}
                                    <span className="text-2xl opacity-40 font-bold">.{formatCurrency(totalSpent, selectedCurrency, currentRate).split('.')[1]}</span>
                                </h2>
                                <p className="text-indigo-100 text-[11px] font-bold mt-1 flex items-center gap-1.5 opacity-80">
                                    <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md font-black">+12.5%</span>
                                    from last month
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-2.5 text-indigo-100 text-[10px] font-bold group/sync">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="tracking-wide uppercase">Live Insights Active</span>
                                </div>
                                <div className="p-2 bg-white/10 rounded-full group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics and List */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--bg-card)] p-6 rounded-[2.5rem] border border-slate-200 dark:border-[var(--border-color)] shadow-xl flex flex-col h-[440px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                            <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)]">
                                    <PieChartIcon size={22} />
                                </div>
                                <span className="tracking-tight">Spending Analysis</span>
                            </h3>
                            <div className="flex-1 w-full relative">
                                {chartData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height="85%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={110}
                                                    paddingAngle={6}
                                                    dataKey="value"
                                                    stroke="none"
                                                    animationBegin={0}
                                                    animationDuration={1200}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                            className="hover:opacity-90 transition-opacity cursor-pointer outline-none"
                                                        />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(10px)',
                                                        borderColor: 'transparent',
                                                        borderRadius: '20px',
                                                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                                        padding: '12px 16px'
                                                    }}
                                                    itemStyle={{ color: '#1e293b', fontSize: '13px', fontWeight: '800' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Center Total Label */}
                                        <div className="absolute top-[42.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Total Monthly Spend</p>
                                            <p className="text-xl font-black text-[var(--text-main)] tracking-tighter">
                                                {formatCurrency(totalSpent, selectedCurrency, currentRate).split('.')[0]}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 px-2">
                                            {chartData.slice(0, 3).map((entry, index) => (
                                                <div key={entry.name} className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{entry.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-medium italic">
                                        No spending data yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary List Card */}
                        <div className="bg-[var(--bg-card)] p-6 rounded-[2.5rem] border border-slate-200 dark:border-[var(--border-color)] shadow-xl flex flex-col h-[440px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)]">
                                    <List size={22} />
                                </div>
                                <span className="tracking-tight">Top Categories</span>
                            </h3>
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                                {([...chartData]).sort((a, b) => b.value - a.value).slice(0, 5).map((cat, idx) => (
                                    <div key={cat.name} className="group/cat flex flex-col gap-2.5 hover:translate-x-1 transition-transform duration-200">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                <span className="text-[var(--text-main)] group-hover/cat:text-[var(--accent-primary)] transition-colors duration-200">{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[var(--text-muted)] opacity-60 font-black">{((cat.value / totalSpent) * 100).toFixed(0)}%</span>
                                                <span className="text-[var(--text-main)] tracking-tight">{formatCurrency(cat.value, selectedCurrency, currentRate)}</span>
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 dark:bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1200 ease-in-out"
                                                style={{
                                                    width: `${(cat.value / totalSpent) * 100}%`,
                                                    backgroundColor: COLORS[idx % COLORS.length],
                                                    boxShadow: `0 0 10px ${COLORS[idx % COLORS.length]}66`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {chartData.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-medium italic">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-slate-200 dark:border-[var(--border-color)] shadow-xl space-y-8 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-[var(--text-main)] flex items-center gap-3">
                                <div className="p-3 bg-slate-50 dark:bg-[var(--bg-primary)] rounded-2xl text-[var(--accent-primary)] border border-slate-100 dark:border-[var(--border-color)] shadow-sm">
                                    <List size={22} />
                                </div>
                                <span>Recent Transitions</span>
                            </h3>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[var(--bg-primary)] px-4 py-1.5 rounded-2xl border border-slate-100 dark:border-[var(--border-color)]">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">
                                    Total {expenses.length} Records
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="pb-4 px-4">Transaction detail</th>
                                        <th className="pb-4 px-4">Category</th>
                                        <th className="pb-4 px-4 text-right">Amount</th>
                                        <th className="pb-4 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp) => (
                                        <tr key={exp.id} className="group hover:bg-slate-50 dark:hover:bg-[var(--bg-primary)]/40 transition-all duration-200">
                                            <td className="py-5 px-4 first:rounded-l-[1.5rem] border-y border-l border-transparent group-hover:border-slate-100 dark:group-hover:border-[var(--border-color)] transition-all duration-200">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-extrabold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors duration-200 leading-none">{exp.description}</span>
                                                    <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.05em] opacity-60">
                                                        {new Date(exp.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 border-y border-transparent group-hover:border-slate-100 dark:group-hover:border-[var(--border-color)] transition-all duration-200">
                                                <span className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-200
                                                    ${exp.category === 'Food' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm' :
                                                        exp.category === 'Shopping' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm' :
                                                            exp.category === 'Bills' ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' :
                                                                'bg-slate-50 text-slate-600 border-slate-100 shadow-sm'}
                                                `}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-right font-black text-[var(--text-main)] border-y border-transparent group-hover:border-slate-100 dark:group-hover:border-[var(--border-color)] tabular-nums text-sm transition-all duration-200">
                                                {formatCurrency(exp.amount, selectedCurrency, currentRate)}
                                            </td>
                                            <td className="py-5 px-4 text-center last:rounded-r-[1.5rem] border-y border-r border-transparent group-hover:border-slate-100 dark:group-hover:border-[var(--border-color)] transition-all duration-200">
                                                <button
                                                    onClick={() => handleDeleteExpense(exp.id)}
                                                    disabled={isDeleting === exp.id}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all duration-200 active:scale-90 active:rotate-6 shadow-transparent"
                                                >
                                                    {isDeleting === exp.id ? <Loader2 className="animate-spin" size={19} /> : <Trash2 size={19} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {expenses.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-30 grayscale translate-y-2">
                                                    <div className="p-5 bg-slate-50 rounded-full border-2 border-dashed border-slate-200">
                                                        <CreditCard size={48} />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest">Awaiting Transactions</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
