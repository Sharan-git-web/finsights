import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    Search,
    Menu,
    X
} from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <img src="/logo.jpg" alt="Finsights Logo" className="w-8 h-8 md:w-10 md:h-10 object-cover bg-slate-900 rounded-lg md:rounded-xl shadow-lg shadow-purple-500/20" />
                        <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase mt-0.5 md:mt-1">
                            FINSIGHTS
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Log in</button>
                        <button onClick={() => navigate('/signup')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-[#020617] border-b border-slate-800 p-6 space-y-6 animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col gap-4 text-base font-bold text-slate-400">
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-white">Features</a>
                            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-white">How it Works</a>
                            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="hover:text-white">Testimonials</a>
                        </div>
                        <div className="flex flex-col gap-3 pt-6 border-t border-slate-800">
                            <button onClick={() => navigate('/login')} className="w-full py-4 text-slate-100 font-black border border-slate-800 rounded-2xl">Log in</button>
                            <button onClick={() => navigate('/signup')} className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg shadow-purple-500/20">Get Started Free</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">

                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-[1.2] md:leading-[1.1] max-w-4xl mx-auto">
                        Own the <span className="bg-gradient-to-r from-purple-400 to-fuchsia-600 bg-clip-text">Future</span> <br />
                        of Your Wealth
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm md:text-xl text-slate-400 font-medium mb-10 md:mb-12 leading-relaxed px-4 md:px-0">
                        Smart portfolio tracking, AI-powered insights, and automated wealth management — all in one platform designed for the modern investor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 md:px-0">
                        <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl text-base md:text-lg font-bold shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                            Start Building Wealth <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto opacity-50 px-4 md:px-0">
                        <div className="flex flex-col items-center">
                            <h4 className="text-2xl md:text-4xl font-black mb-1">$0</h4>
                            <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">Assets</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="text-2xl md:text-4xl font-black mb-1">0</h4>
                            <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">Users</p>
                        </div>
                        <div className="flex flex-col items-center col-span-2 md:col-span-1">
                            <h4 className="text-2xl md:text-4xl font-black mb-1">0%</h4>
                            <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 bg-slate-950/30">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <span className="text-purple-500 font-black text-[10px] md:text-sm uppercase tracking-widest mb-4 block underline underline-offset-8">Features</span>
                    <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-20 text-white">Everything to <span className="text-purple-500">grow wealth</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
                        {[
                            {
                                icon: <BarChart3 className="text-purple-500" size={24} />,
                                title: "Real-Time Tracking",
                                desc: "Monitor all your investments across stocks and crypto in a single unified dashboard."
                            },
                            {
                                icon: <Sparkles className="text-purple-500" size={24} />,
                                title: "Concentration Overview",
                                desc: "Review your exposure across sectors and assets to support informed investment decisions."
                            },
                            {
                                icon: <PieChartIcon className="text-purple-500" size={24} />,
                                title: "Financial Planning",
                                desc: "Calculate your ideal asset allocation based on your unique risk profile and monthly income."
                            },
                            {
                                icon: <Search className="text-purple-500" size={24} />,
                                title: "Multi-Asset Trends",
                                desc: "Analyze performance, allocation, and growth trends across your investments."
                            },
                            {
                                icon: <ShieldAlert className="text-purple-500" size={24} />,
                                title: "Financial Architecture",
                                desc: "Manage assets, plan long-term investments, track wealth growth, and explore government-backed schemes."
                            },
                            {
                                icon: <Globe className="text-purple-500" size={24} />,
                                title: "Global Insights",
                                desc: "Track performance across international markets with full multi-currency support."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl md:rounded-3xl hover:border-purple-500/30 transition-all group hover:-translate-y-1">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{feature.title}</h4>
                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <span className="text-purple-500 font-black text-sm uppercase tracking-widest mb-4 block underline underline-offset-8">How it Works</span>
                    <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-20 text-white">Start in <span className="text-purple-500">3 simple steps</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-slate-800"></div>

                        <div className="relative group p-6 md:p-0 bg-slate-900/20 md:bg-transparent rounded-2xl border border-slate-800 md:border-none">
                            <div className="text-4xl md:text-6xl font-black text-slate-800 mb-4 md:mb-6 group-hover:text-purple-500/20 transition-colors">01</div>
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Add Your Assets</h4>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                                Manually search and add your stock, crypto, or mutual fund holdings to your secure vault.
                            </p>
                        </div>

                        <div className="relative group p-6 md:p-0 bg-slate-900/20 md:bg-transparent rounded-2xl border border-slate-800 md:border-none">
                            <div className="text-4xl md:text-6xl font-black text-slate-800 mb-4 md:mb-6 group-hover:text-purple-500/20 transition-colors">02</div>
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Organize & Plan</h4>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                                Structure your allocation and define long-term strategy concisely.
                            </p>
                        </div>

                        <div className="relative group p-6 md:p-0 bg-slate-900/20 md:bg-transparent rounded-2xl border border-slate-800 md:border-none">
                            <div className="text-4xl md:text-6xl font-black text-slate-800 mb-4 md:mb-6 group-hover:text-purple-500/20 transition-colors">03</div>
                            <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Optimize & Grow</h4>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                                Use the Financial Planner to stay on track and watch your wealth compound.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-slate-950">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 leading-[1.2] md:leading-[1.1]">
                        Control your <br />
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">financial future?</span>
                    </h2>
                    <p className="text-sm md:text-lg text-slate-400 font-medium mb-10 md:mb-12">
                        Join investors who are already building wealth smarter. <br className="hidden md:block" /> Start free, no credit card required.
                    </p>
                    <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-2xl text-lg md:text-xl font-bold shadow-2xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto group">
                        Get Started Free <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-slate-800/50 text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">© 2026 FINSIGHTS. All rights reserved.</p>
            </footer>
        </div>
    );
}
