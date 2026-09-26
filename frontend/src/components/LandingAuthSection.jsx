import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Lock,
  Mail,
  KeyRound,
  Building2,
  UserCircle,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';

export function LandingAuthSection({ onEnterWarRoom, onExploreDossiers }) {
  const { user, isAuthenticated, login, register, loginWithGoogleCredential, logout } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: 'General Partner',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!formData.email || !formData.password) {
          throw new Error('Please provide both your institutional email and password.');
        }
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          throw new Error(result.error || 'Authentication failed. Please check credentials.');
        }
      } else {
        // Register validation
        if (!formData.name.trim()) throw new Error('Full Name is required.');
        if (!formData.email.trim()) throw new Error('Work Email is required.');
        if (!formData.organization.trim()) throw new Error('Syndicate / Firm Name is required.');
        if (formData.password.length < 6) throw new Error('Password must be at least 6 characters long.');
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        const result = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          organization: formData.organization.trim(),
          role: formData.role,
        });

        if (!result.success) {
          throw new Error(result.error || 'Registration failed.');
        }
        setSuccessMessage('Syndicate account created. Session verified.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show personalized quick-action command box
  if (isAuthenticated && user) {
    return (
      <section
        id="auth-section"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AUTHENTICATED SESSION ACTIVE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name}
            </h3>
            <p className="text-sm text-slate-300">
              {user.role || 'General Partner'} • {user.organization || user.syndicate || 'PitchVane Syndicate'} ({user.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onEnterWarRoom}
              className="btn-gradient-glow text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>Enter Live War Room</span>
            </button>
            <button
              type="button"
              onClick={onExploreDossiers}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Browse Dossiers
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-xs font-mono text-slate-400 hover:text-rose-400 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Not Authenticated: Interactive Sign In / Sign Up Portal
  return (
    <section id="auth-section" className="scroll-mt-20">
      <div className="bg-[#0b1120] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Neon Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 relative z-10">
          {/* Left Column: Institutional Value Prop */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-slate-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSTITUTIONAL ACCESS PORTAL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Sign In or Register for Real-Time Due Diligence
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Connect your institutional credentials to deploy 4 parallel agents, audit private vector shards, and generate synthesized IC memos in 120 seconds.
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">4-Agent Research Team</h4>
                  <p className="text-xs text-slate-400">Market, Competitor, Financial, and Risk analysis streaming simultaneously.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dual-Pass Contradiction Engine</h4>
                  <p className="text-xs text-slate-400">Cross-checks founder claims against live web grounding & vector embeddings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">SOC2 Type II &amp; Zero Retention</h4>
                  <p className="text-xs text-slate-400">Confidential deal materials are isolated and never retained for public model training.</p>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted • JWT Token Signed</span>
            </div>
          </div>

          {/* Right Column: Interactive Sign In / Register Card */}
          <div className="lg:col-span-7 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Syndicate
              </button>
            </div>

            {/* Google Single Sign-On */}
            <div className="mb-5 flex flex-col items-center">
              <div className="w-full flex justify-center bg-slate-900/60 p-2 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    loginWithGoogleCredential(credentialResponse);
                  }}
                  onError={() => {
                    setErrorMessage('Google Authentication failed.');
                  }}
                  shape="pill"
                  theme="filled_black"
                  size="large"
                  text={mode === 'signin' ? 'signin_with' : 'signup_with'}
                  width="100%"
                />
              </div>

              <div className="relative w-full flex items-center justify-center my-4">
                <div className="w-full border-t border-slate-800" />
                <span className="bg-[#0f172a] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Or Continue With JWT Password
                </span>
              </div>
            </div>

            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-emerald-400 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserCircle className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Alex Vance"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Syndicate / Firm</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="organization"
                          required
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Apex Syndicate"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Role</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="General Partner">General Partner</option>
                          <option value="Managing Partner">Managing Partner</option>
                          <option value="Principal">Principal Diligence Lead</option>
                          <option value="Venture Associate">Venture Associate</option>
                          <option value="Limited Partner">LP / Family Office</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {mode === 'signin' ? 'Work Email' : 'Institutional Work Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="partner@venturefund.vc"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Syndicate Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
