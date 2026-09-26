import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import { TrendingUp, Timer, FileText, Users, Radar, Lock, Sparkles, ShieldCheck, LogIn, UserPlus, ArrowRight, Eye, EyeOff, Key, Mail, Building, Briefcase, Zap, AlertCircle, CheckCircle2, User } from 'lucide-react';

const STATS = [
  { label: 'Deals Analyzed', value: '14,200+', icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30' },
  { label: 'Avg. Diligence Time', value: '< 3 min', icon: Timer, color: 'text-indigo-600 dark:text-orange-400', bg: 'bg-indigo-50 dark:bg-orange-950/60 border-indigo-200 dark:border-orange-500/30' },
  { label: 'IC Memos Generated', value: '4,800+', icon: FileText, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-500/30' },
  { label: 'Partner Syndicates', value: '380+', icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30' },
];

function StatTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % STATS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const stat = STATS[idx];
  const IconComp = stat.icon;
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${stat.bg} transition-all backdrop-blur-md`}>
      <IconComp className={`w-5 h-5 ${stat.color}`} />
      <div>
        <div className="font-telemetry-sm text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
        <div className={`font-headline-md text-xl font-extrabold ${stat.color} tracking-tight leading-tight`}>{stat.value}</div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Radar, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30', title: 'Autonomous 4-Agent Research Team', desc: 'Market, Competitor, Financial & Regulatory analysis — simultaneously in 120s.' },
  { icon: Lock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30', title: 'Zero Data Retention', desc: 'Your deal materials are processed privately and never stored in shared systems.' },
  { icon: FileText, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-500/30', title: 'IC-Grade Conviction Memos', desc: 'Structured investment committee memos that your team can action immediately.' },
];

export function AuthView({ initialMode = 'signin', onSuccess }) {
  const { user, isAuthenticated, login, register, loginWithGoogleCredential, logout, googleEnabled } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: 'General Partner',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        if (!formData.email || !formData.password) throw new Error('Please enter your email and password.');
        const result = await login(formData.email, formData.password);
        if (!result.success) throw new Error(result.error || 'Authentication failed. Please verify credentials.');
        setSuccessMessage('Authentication successful! Redirecting to workspace...');
        if (onSuccess) setTimeout(() => onSuccess(), 600);
      } else {
        if (!formData.name.trim()) throw new Error('Full Name is required.');
        if (!formData.email.trim()) throw new Error('Work Email is required.');
        if (!formData.organization.trim()) throw new Error('Firm / Syndicate name is required.');
        if (formData.password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match.');
        const result = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          organization: formData.organization.trim(),
          role: formData.role,
        });
        if (!result.success) throw new Error(result.error || 'Registration failed.');
        setSuccessMessage('Account created! Redirecting to workspace...');
        if (onSuccess) setTimeout(() => onSuccess(), 600);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrorMessage('');
    const result = await loginWithGoogleCredential(credentialResponse);
    setLoading(false);
    if (result.success) {
      setSuccessMessage('Google authentication verified! Entering workspace...');
      if (onSuccess) setTimeout(() => onSuccess(), 600);
    } else {
      setErrorMessage(result.error || 'Google login failed.');
    }
  };

  const fillDemoCredentials = () => {
    setMode('signin');
    setFormData((prev) => ({
      ...prev,
      email: 'ayan@pitchvane.ai',
      password: 'pitchvane2026',
    }));
    setErrorMessage('');
  };

  // Logged-in Account Hub
  if (isAuthenticated && user) {
    return (
      <div className="animate-in fade-in duration-200 max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {user.picture || user.avatar ? (
                <img src={user.picture || user.avatar} alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-white/20 shadow-sm shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                  {user.name?.charAt(0).toUpperCase() ?? 'P'}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
                  <span className="font-telemetry-sm text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">VERIFIED</span>
                </div>
                <p className="font-telemetry-sm text-xs text-indigo-600 dark:text-cyan-400 font-semibold">{user.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.role || 'General Partner'} · {user.organization || 'PitchVane Syndicate'}</p>
              </div>
              <button type="button" onClick={logout}
                className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold font-telemetry-sm transition-colors cursor-pointer shrink-0">
                Sign Out
              </button>
            </div>

            <div className="mt-6">
              <button type="button" onClick={() => onSuccess && onSuccess()}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 inline-flex items-center justify-center gap-2 text-white font-bold text-[13px] px-6 py-3.5 rounded-2xl transition-all tracking-wide uppercase cursor-pointer shadow-md">
                <Sparkles className="w-4 h-4" />
                <span>Enter Live War Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 focus:bg-white dark:focus:bg-black/80 border-2 border-slate-200 dark:border-white/15 hover:border-indigo-300 dark:hover:border-cyan-400/40 focus:border-indigo-600 dark:focus:border-cyan-400 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-medium';
  const labelCls = 'block text-[11px] font-telemetry-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5';

  return (
    <div className="relative animate-in fade-in duration-300 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">

        {/* ── Left Column: Brand & Feature Showcase ── */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between space-y-5 lg:space-y-6">
          <div className="bg-white/95 dark:bg-[#060b19]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 rounded-3xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-orange-500" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-cyan-950/80 border border-indigo-100 dark:border-cyan-500/30 text-indigo-700 dark:text-cyan-300 font-telemetry-sm text-[10px] font-extrabold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Native Deal Intelligence
              </div>
              <h1 className="font-headline-lg text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
                {mode === 'signin' ? 'Welcome Back to PitchVane' : 'Join the PitchVane Network'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {mode === 'signin'
                  ? 'Access your private deal flow, live 4-agent analysis war room, and synthesized investment committee reports.'
                  : 'Register your venture fund or investment syndicate to start automated due diligence in under 3 minutes.'}
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3">
            {FEATURES.map(({ icon: IconComp, color, bg, title, desc }) => (
              <div
                key={title}
                className="bg-white/90 dark:bg-[#060b19]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs hover:border-indigo-300 dark:hover:border-cyan-400/40 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center shrink-0`}>
                  <IconComp className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h4 className="font-telemetry-sm text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <StatTicker />
          </div>
        </div>

        {/* ── Right Column: Interactive Auth Card ── */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white/95 dark:bg-[#060b19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-600 to-orange-500" />

            <div className="p-6 sm:p-9">
              {/* Segmented Mode Switcher Tabs */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl mb-5">
                {[
                  { id: 'signin', label: 'Sign In', icon: LogIn },
                  { id: 'register', label: 'Create Account', icon: UserPlus },
                ].map(({ id, label, icon: IconComp }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setMode(id); setErrorMessage(''); setSuccessMessage(''); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      mode === id
                        ? 'bg-white dark:bg-white/15 text-indigo-700 dark:text-white shadow-sm border border-slate-200/60 dark:border-cyan-400/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Google SSO Button */}
              <div className="mb-4">
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMessage('Google Authentication failed. Please check your credentials or network.')}
                    shape="pill"
                    theme="outline"
                    size="large"
                    text={mode === 'signin' ? 'signin_with' : 'signup_with'}
                    width="100%"
                  />
                </div>
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 dark:border-white/10 w-full"></div>
                  <span className="bg-white dark:bg-[#060b19] px-3 text-[10px] font-telemetry-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Or with Email
                  </span>
                </div>
              </div>

              {/* Status & Error Alerts */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Alex Vance"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Firm / Syndicate</label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            name="organization"
                            required
                            value={formData.organization}
                            onChange={handleChange}
                            placeholder="Apex Syndicate"
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Role</label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`${inputCls} appearance-none cursor-pointer pr-10`}
                          >
                            <option value="General Partner">General Partner</option>
                            <option value="Managing Partner">Managing Partner</option>
                            <option value="Principal">Principal</option>
                            <option value="Venture Associate">Venture Associate</option>
                            <option value="Limited Partner">LP / Family Office</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className={labelCls}>{mode === 'signin' ? 'Work Email' : 'Institutional Email'}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="partner@venturefund.vc"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls.replace('mb-1.5', '')}>Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="text-[11px] font-telemetry-sm font-bold text-indigo-600 dark:text-cyan-400 hover:underline transition-colors cursor-pointer"
                      >
                        Auto-fill Demo Credentials
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {mode === 'register' && (
                  <div>
                    <label className={labelCls}>Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`${inputCls} pr-11`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Gradient Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 hover:opacity-95 text-white font-bold text-[13px] py-4 rounded-2xl transition-all tracking-wide uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-3"
                >
                  <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Syndicate Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick 1-Click Demo Shortcut */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-telemetry-sm">
                <span className="text-slate-500 dark:text-slate-400">Need instant access?</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Use Dev Demo Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
