import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Activity, FileText, BarChart3, Swords, X, Rocket, LogIn, LogOut, User, Menu, Layers, Sun, Moon } from 'lucide-react';

export function Header({ activeTab, onTabChange, isConnected = true }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const navItems = [
    { id: 'warroom', label: 'Live War Room', icon: Activity, isLive: true },
    { id: 'dealflow', label: 'Deal Flow', icon: BarChart3 },
    { id: 'dossiers', label: 'Dossiers', icon: FileText },
    { id: 'compare', label: 'Deal Battle', icon: Swords },
  ];

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="print:hidden sticky top-0 z-50 bg-white/90 dark:bg-[#030712]/85 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl transition-colors">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-16">
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group cursor-pointer text-left focus:outline-none"
          >
            {/* Mesh glowing logo badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-orange-500 p-[1px] shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 dark:bg-black rounded-xl flex items-center justify-center text-white">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-headline-lg text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Pitch<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-orange-500">vane</span>
            </span>
          </button>

          {/* Compact Engine Status Beacon */}
          <div
            className="hidden xl:flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-300 backdrop-blur-md"
            title={isConnected ? 'Live AI Stream Connected' : 'Connecting...'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                isConnected ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">v2.4 Core</span>
          </div>
        </div>

        {/* Center: Clean Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-orange-500/20 text-indigo-700 dark:text-white border border-indigo-200 dark:border-cyan-400/40 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping"></span>
                )}

              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle + Search + Launch CTA + Google Auth Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-2xs"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>



          {/* Quick Launch Pipeline CTA */}
          <button
            type="button"
            onClick={() => handleNavClick('warroom')}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-full transition-all tracking-wide uppercase shadow-md hover:shadow-cyan-500/20 cursor-pointer whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Launch</span>
          </button>

          {/* Google Auth / Profile Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 rounded-full transition-all cursor-pointer backdrop-blur-md"
              >
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">{user.name}</span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-cyan-400 block">{user.organization || user.syndicate || 'Venture Partner'}</span>
                </div>
                {!avatarError && (user.picture || user.avatar) ? (
                  <img
                    src={user.picture || user.avatar}
                    alt={user.name}
                    onError={() => setAvatarError(true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 dark:border-white/20 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 dark:to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl p-3 space-y-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
                  <div className="p-2 border-b border-slate-100 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{user.name}</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">{user.email}</span>
                    <span className="text-[10px] font-mono text-indigo-700 dark:text-cyan-300 bg-indigo-50 dark:bg-cyan-950/80 border border-indigo-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold">
                      {user.role || 'General Partner'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick('profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick('dealflow');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                    Deal Flow
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer font-semibold border-t border-slate-100 dark:border-white/5 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('auth')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 border border-transparent dark:border-white/20 text-white font-semibold text-xs transition-all cursor-pointer backdrop-blur-md shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#060a17]/95 px-4 py-3 space-y-2 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white border border-indigo-200 dark:border-cyan-400/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </span>
                {item.isLive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
                )}

              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
