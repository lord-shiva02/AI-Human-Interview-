import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bot, 
  LayoutDashboard, 
  PlayCircle, 
  History, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userProfile = mockInterviewService.getUserProfile();

  // Hide standard navbar on the immersive active interview session page
  if (location.pathname === '/interview/session') {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Bot },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Start Interview', path: '/interview/setup', icon: PlayCircle, highlight: true },
    { name: 'Interview History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090D16]/80 border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LEFT: Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="AI Interview Assistant Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#090D16] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  AI Interview Assistant
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  v2.4 PRO
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-wide">
                Resume-Grounded HR Simulation
              </p>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/[0.06] shadow-inner shadow-black/40">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `
                    relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2
                    ${isActive 
                      ? 'text-cyan-300 bg-cyan-500/15 shadow-sm shadow-cyan-500/20 border border-cyan-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }
                    ${link.highlight && !location.pathname.startsWith(link.path) 
                      ? 'text-indigo-300 hover:text-indigo-200' 
                      : ''
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full shadow-sm shadow-cyan-400"></span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* RIGHT: Notifications, User Profile & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.08] text-slate-300 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-200 focus:outline-none"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full ring-2 ring-[#090D16]"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-900/95 border border-white/10 p-4 shadow-2xl backdrop-blur-2xl z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">System Notifications</span>
                    <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                      <p className="font-semibold text-cyan-200">ATS Engine v2.4 Active</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Resume analysis parses over 18 structured metadata dimensions.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                      <p className="font-semibold text-slate-200">New Performance Benchmark</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Your communication score improved +12% in the latest session.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Name */}
            <Link 
              to="/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-cyan-500/30 hover:bg-slate-800/70 transition-all duration-200 group"
            >
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40 group-hover:ring-cyan-400 transition-all"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors leading-none">
                  {userProfile.name}
                </p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">
                  Candidate
                </p>
              </div>
            </Link>

            {/* Logout / Switch User */}
            <button
              onClick={() => navigate('/login')}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.08] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-200 focus:outline-none"
              title="Sign Out / Switch Account"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => navigate('/interview/setup')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-cyan-500/30"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B101D]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-slate-800/60 border border-white/5">
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
            />
            <div>
              <p className="font-bold text-sm text-white">{userProfile.name}</p>
              <p className="text-xs text-cyan-400">{userProfile.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
                    ${isActive 
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30' 
                      : 'text-slate-300 hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout / Switch User</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
