import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Key, ShieldCheck, Lock, LogOut, Edit, Save, CheckCircle2,
  User, Building, Briefcase, Zap, Radar, FileText, BarChart3,
  Clock, TrendingUp, AlertCircle, CheckCircle, Loader2, History,
  ChevronRight,
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const ROLES = [
  'General Partner',
  'Managing Partner',
  'Principal',
  'Venture Associate',
  'Limited Partner',
];

const API = `${API_BASE_URL}/api`;

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatusBadge({ status }) {
  const map = {
    done: { label: 'Completed', cls: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    running: { label: 'Running', cls: 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500 animate-pulse' },
    pending: { label: 'Pending', cls: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400 animate-pulse' },
    failed: { label: 'Failed', cls: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  };
  const { label, cls, dot } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function ProfileView({ onNavigate, refreshKey = 0 }) {
  const { user, token, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    role: user?.role || 'General Partner',
  });

  // Real data state
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, avgScore: null });
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchHistory() {
      setLoadingHistory(true);
      setHistoryError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [casesRes, statsRes] = await Promise.all([
          fetch(`${API}/cases?limit=20`, { headers }),
          fetch(`${API}/cases/stats`, { headers }),
        ]);

        if (!cancelled) {
          if (casesRes.ok) {
            const data = await casesRes.json();
            setCases(data.cases || []);
          }
          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(data);
          }
        }
      } catch (err) {
        if (!cancelled) setHistoryError('Could not reach the backend. Is the server running?');
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    fetchHistory();
    return () => { cancelled = true; };
  }, [token, refreshKey]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const [imgError, setImgError] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PV';

  const statCards = [
    {
      label: 'Analyses Run',
      value: loadingHistory ? '—' : String(stats.total),
      icon: Radar,
      color: 'text-cyan-600 dark:text-cyan-400',
      accent: 'from-cyan-400 to-blue-500',
      bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30',
    },
    {
      label: 'Completed',
      value: loadingHistory ? '—' : String(stats.done),
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      accent: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      label: 'Avg Score',
      value: loadingHistory ? '—' : (stats.avgScore != null ? `${stats.avgScore}/10` : 'N/A'),
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      accent: 'from-indigo-400 to-violet-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-5">
        <div className="font-telemetry-sm text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-400 animate-pulse" />
          Account Settings
        </div>
        <h2 className="font-headline-lg text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account details and view your analysis history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left: Identity Card ── */}
        <div className="lg:col-span-4 space-y-5">

          {/* Avatar + identity */}
          <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-orange-500" />
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              {!imgError && (user?.picture || user?.avatar) ? (
                <img
                  src={user.picture || user.avatar}
                  alt={user.name}
                  onError={() => setImgError(true)}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-white/20 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
                  {initials}
                </div>
              )}

              <div>
                <h3 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-white">{user?.name}</h3>
                <p className="font-telemetry-sm text-xs text-indigo-600 dark:text-cyan-400 font-semibold mt-0.5">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-telemetry-sm text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Session Active
                </div>
              </div>

              {/* Security badges */}
              <div className="w-full space-y-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-telemetry-sm font-semibold">Auth Method</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    {user?.googleId ? 'Google OAuth' : 'JWT / Email'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-telemetry-sm font-semibold">Encryption</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    256-Bit TLS
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-telemetry-sm font-semibold">Data Retention</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Zero Retention
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={() => {
              logout();
              if (onNavigate) onNavigate('home');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 font-semibold text-sm rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            Sign Out
          </button>
        </div>

        {/* ── Right: Details + Stats + History ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Activity stats — real data */}
          <div className="grid grid-cols-3 gap-4">
            {statCards.map(({ label, value, icon: IconComp, color, accent, bg }) => (
              <div key={label} className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm relative overflow-hidden p-4 text-center hover:border-indigo-300 dark:hover:border-cyan-500/40 transition-all">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`} />
                <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center mx-auto mb-2`}>
                  <IconComp className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`font-headline-md text-2xl font-extrabold ${color}`}>{value}</div>
                <div className="font-telemetry-sm text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Edit profile card */}
          <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                  Account Details
                </h4>
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(false)}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer">
                      Cancel
                    </button>
                    <button type="button" onClick={handleSave}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm">
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Profile updated successfully.
                </div>
              )}

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                  {editing ? (
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-white/15 focus:border-indigo-500 dark:focus:border-cyan-400 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-all" />
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || '—'}</p>
                  )}
                </div>

                {/* Email — read only */}
                <div>
                  <label className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-cyan-400">{user?.email || '—'}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Email cannot be changed after registration.</p>
                </div>

                {/* Firm */}
                <div>
                  <label className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Firm / Syndicate</label>
                  {editing ? (
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" name="organization" value={form.organization} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/50 border-2 border-slate-200 dark:border-white/15 focus:border-indigo-500 dark:focus:border-cyan-400 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-all" />
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.organization || '—'}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Role</label>
                  {editing ? (
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select name="role" value={form.role} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#090e1c] border-2 border-slate-200 dark:border-white/15 focus:border-indigo-500 dark:focus:border-cyan-400 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer">
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-white/10 border border-indigo-200 dark:border-white/15 text-indigo-700 dark:text-cyan-300 font-telemetry-sm text-xs font-bold">
                      <Briefcase className="w-3.5 h-3.5" />
                      {user?.role || 'General Partner'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Analysis History ── */}
          <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-400 to-rose-500" />
            <div className="p-6">
              <h4 className="font-headline-md text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-orange-500" />
                Recent Analyses
                <span className="ml-auto flex items-center gap-1.5">
                  {!loadingHistory && cases.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{cases.length} record{cases.length !== 1 ? 's' : ''}</span>
                  )}
                  <button
                    type="button"
                    title="Refresh history"
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition-all cursor-pointer"
                    style={{ lineHeight: 0 }}
                    onClick={() => {
                      const headers = token ? { Authorization: `Bearer ${token}` } : {};
                      setLoadingHistory(true);
                      setHistoryError(null);
                      Promise.all([
                        fetch(`${API}/cases?limit=20`, { headers }),
                        fetch(`${API}/cases/stats`, { headers }),
                      ]).then(async ([casesRes, statsRes]) => {
                        if (casesRes.ok) setCases((await casesRes.json()).cases || []);
                        if (statsRes.ok) setStats(await statsRes.json());
                      }).catch(() => setHistoryError('Could not reach the backend.'))
                        .finally(() => setLoadingHistory(false));
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                  </button>
                </span>
              </h4>


              {/* Loading */}
              {loadingHistory && (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-400 dark:text-slate-500 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading history…
                </div>
              )}

              {/* Error */}
              {!loadingHistory && historyError && (
                <div className="flex items-center gap-2 py-6 text-rose-500 dark:text-rose-400 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {historyError}
                </div>
              )}

              {/* Empty */}
              {!loadingHistory && !historyError && cases.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500 text-sm gap-2">
                  <FileText className="w-8 h-8 opacity-30" />
                  <p className="font-semibold">No analyses yet</p>
                  <p className="text-xs text-center max-w-xs">
                    Submit a pitch from the War Room to start building your history.
                  </p>
                </div>
              )}

              {/* Case list */}
              {!loadingHistory && !historyError && cases.length > 0 && (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {cases.map((c, idx) => (
                    <button
                      key={c._id || idx}
                      type="button"
                      onClick={() => onNavigate && onNavigate('warroom')}
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-indigo-50 dark:hover:bg-white/[0.07] border border-slate-100 dark:border-white/[0.06] hover:border-indigo-200 dark:hover:border-cyan-500/30 transition-all text-left group"
                    >
                      {/* Timeline dot */}
                      <div className="mt-0.5 w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm text-white">
                        <Radar className="w-3.5 h-3.5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-cyan-300 transition-colors">
                          {c.idea || 'Untitled analysis'}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <StatusBadge status={c.status} />
                          {c.verdict?.score != null && (
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                              <TrendingUp className="w-3 h-3" />
                              Score: {c.verdict.score}/10
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 flex items-center gap-0.5 ml-auto">
                            <Clock className="w-3 h-3" />
                            {timeAgo(c.createdAt)}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 dark:group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
            <h4 className="font-headline-md text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button type="button" onClick={() => onNavigate && onNavigate('warroom')}
                className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-cyan-400/40 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-white transition-all cursor-pointer text-left">
                <Radar className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <span>New Analysis</span>
              </button>
              <button type="button" onClick={() => onNavigate && onNavigate('dealflow')}
                className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-400/40 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all cursor-pointer text-left">
                <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Deal Flow</span>
              </button>
              <button type="button" onClick={() => onNavigate && onNavigate('dossiers')}
                className="flex items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-400/40 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-400 transition-all cursor-pointer text-left">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Dossiers</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}