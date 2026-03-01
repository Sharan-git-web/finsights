import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, TrendingUp, Chrome } from 'lucide-react';
import { Input } from './modules/shared';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (!agreeTerms) {
            setError("You must agree to the Terms of Service");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error: signUpError } = await signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });

            if (signUpError) throw signUpError;

            setIsSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
                <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[32px] p-10 text-center space-y-6 shadow-2xl relative z-10">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white">Check your email</h2>
                        <p className="text-slate-400 font-medium">
                            We've sent a verification link to <span className="text-white font-bold">{email}</span>.
                            Please verify your account to continue.
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="block w-full bg-slate-900/50 border-2 border-slate-800 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <TrendingUp size={22} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                            FINSIGHTS
                        </h1>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                        <p className="text-slate-400 font-medium">Get started with FINSIGHTS</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 shadow-2xl space-y-8">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold animate-in shake duration-300">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={setName}
                                required
                                placeholder="John Doe"
                                prefix={<User size={18} className="text-slate-500" />}
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                required
                                placeholder="you@example.com"
                                prefix={<Mail size={18} className="text-slate-500" />}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={setPassword}
                                required
                                placeholder="Create a strong password"
                                prefix={<Lock size={18} className="text-slate-500" />}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                required
                                placeholder="Confirm your password"
                                prefix={<Lock size={18} className="text-slate-500" />}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-slate-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />

                            <div className="px-1">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500/30 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                                        I agree to the <Link to="/terms" className="text-purple-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-500 hover:underline">Privacy Policy</Link>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-5 rounded-[20px] font-black text-lg shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : null}
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0f172a] px-4 text-slate-500 font-black tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-slate-900/50 border-2 border-slate-800 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                    >
                        <Chrome size={20} className="text-white group-hover:scale-110 transition-transform" />
                        Continue with Google
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-slate-400 font-bold">
                            Already have an account? {' '}
                            <Link to="/login" className="text-purple-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
