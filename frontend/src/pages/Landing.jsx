import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Sparkles,
    ShieldCheck,
    Zap,
    ArrowRight,
    Play,
    Star,
    CheckCircle2,
    BarChart3,
    PieChart as PieChartIcon,
    ShieldAlert,
    Globe,
    Search
} from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.jpg" alt="Finsights Logo" className="w-10 h-10 object-cover bg-slate-900 rounded-xl shadow-lg shadow-purple-500/20" />
                        <h1 className="text-2xl font-black tracking-tighter uppercase mt-1">
                            FINSIGHTS
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Log in</button>
                        <button onClick={() => navigate('/signup')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-[1.1]">
                        Own the <span className="bg-gradient-to-r from-purple-400 to-fuchsia-600 bg-clip-text">Future</span> <br />
                        of Your Wealth
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed">
                        Smart portfolio tracking, AI-powered insights, and automated wealth management — all in one platform designed for the modern investor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => navigate('/signup')} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
                            Start Building Wealth <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto opacity-50">
                        <div className="flex flex-col items-center">
                            <h4 className="text-4xl font-black mb-1">$0</h4>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Assets Tracked</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="text-4xl font-black mb-1">0</h4>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Users</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="text-4xl font-black mb-1">0%</h4>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-950/30">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-purple-500 font-black text-sm uppercase tracking-widest mb-4 block">Features</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-20 text-white">Everything you need to <span className="text-purple-500">grow your wealth</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        {[
                            {
                                icon: <BarChart3 className="text-purple-500" size={24} />,
                                title: "Real-Time Portfolio Tracking",
                                desc: "Monitor all your investments across stocks and crypto in a single unified dashboard."
                            },
                            {
                                icon: <Sparkles className="text-purple-500" size={24} />,
                                title: "Portfolio Concentration Overview",
                                desc: "Review your exposure across sectors and assets to support informed investment decisions."
                            },
                            {
                                icon: <PieChartIcon className="text-purple-500" size={24} />,
                                title: "Advanced Financial Planning",
                                desc: "Calculate your ideal asset allocation based on your unique risk profile and monthly income."
                            },
                            {
                                icon: <Search className="text-purple-500" size={24} />,
                                title: "Multi-Asset Overview",
                                desc: "Analyze performance, allocation, and growth trends across your investments."
                            },
                            {
                                icon: <ShieldAlert className="text-purple-500" size={24} />,
                                title: "Financial Architecture Overview",
                                desc: "Manage assets, plan long-term investments, track wealth growth, and explore government-backed schemes — all in one unified system."
                            },
                            {
                                icon: <Globe className="text-purple-500" size={24} />,
                                title: "Global Market Insights",
                                desc: "Track performance across international markets with full multi-currency support."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-purple-500/30 transition-all group hover:-translate-y-1">
                                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-4 text-white">{feature.title}</h4>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-purple-500 font-black text-sm uppercase tracking-widest mb-4 block">How it Works</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-20 text-white">Start in <span className="text-purple-500">3 simple steps</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-slate-800"></div>

                        <div className="relative group">
                            <div className="text-6xl font-black text-slate-800 mb-6 group-hover:text-purple-500/20 transition-colors">01</div>
                            <h4 className="text-xl font-bold mb-4 text-white">Add Your Assets</h4>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Manually search and add your stock, crypto, or mutual fund holdings to your secure vault.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="text-6xl font-black text-slate-800 mb-6 group-hover:text-purple-500/20 transition-colors">02</div>
                            <h4 className="text-xl font-bold mb-4 text-white">Organize & Plan</h4>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Structure your allocation and define long-term strategy.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="text-6xl font-black text-slate-800 mb-6 group-hover:text-purple-500/20 transition-colors">03</div>
                            <h4 className="text-xl font-bold mb-4 text-white">Optimize & Grow</h4>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Use the Financial Planner to stay on track and watch your wealth compound over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-purple-500 font-black text-sm uppercase tracking-widest mb-4 block">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-20 text-white">Trusted by <span className="text-purple-500">thousands</span></h2>

                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                        <p className="text-slate-400 font-bold mb-2">Testimonials coming soon...</p>
                        <p className="text-sm text-slate-500">Be among our first success stories.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-slate-950">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
                        Ready to take control of your <br />
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">financial future?</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-medium mb-12">
                        Join 50,000+ investors who are already building wealth smarter. <br className="hidden md:block" /> Start free, no credit card required.
                    </p>
                    <button onClick={() => navigate('/signup')} className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto group">
                        Get Started Free <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>
        </div>
    );
}
