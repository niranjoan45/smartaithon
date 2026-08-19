import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore, UserRole } from '../stores/useAuthStore';

export function LandingLoginPage() {
  const navigate = useNavigate();
  const { loginAsRole } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState('s.vance@cityguardian.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('s.vance@cityguardian.gov');
    } else {
      setEmail('alex.mercer@citycitizen.org');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      navigate('/command');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="w-screen h-screen bg-[#070a0f] text-slate-100 font-mono select-none flex flex-col justify-between items-center relative overflow-hidden p-6">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,5,23,0.25)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950 border border-red-600/60 text-red-500 shadow-lg animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-orbitron font-extrabold text-lg text-white tracking-wider">
              AI CITY GUARDIAN
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Municipal Safety & Emergency Command
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2.5 py-1 rounded font-bold">
          v1.0 LIVE
        </span>
      </header>

      {/* Center Authenticator Form Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-slate-900/95 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-1.5 border-b border-slate-800 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-orange-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTICATION PORTAL</span>
            </div>
            <h2 className="font-orbitron font-bold text-xl text-white">
              SIGN IN TO WORKSPACE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Select your role and enter credentials to access system
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
              SELECT ACCESS ROLE
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-amber-400 text-black shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('USER')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'USER'
                    ? 'bg-cyan-500 text-black shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>CITIZEN</span>
              </button>
            </div>
          </div>

          {/* Login Form Fields */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            {/* Email Field */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                <span>EMAIL ADDRESS / USER ID</span>
                <span className="text-[10px] text-slate-500">
                  {selectedRole === 'ADMIN' ? 'Commander Access' : 'Public Citizen'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cityguardian.gov"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                PASSWORD / ACCESS KEY
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Remember & Role Indicator */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-0"
                />
                <span>Remember session</span>
              </label>

              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                256-Bit SSL Encrypted
              </span>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-orbitron font-extrabold text-xs transition-all shadow-xl flex items-center justify-center gap-2 mt-2 ${
                selectedRole === 'ADMIN'
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-400/20'
              }`}
            >
              <span>SIGN IN AS {selectedRole}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill Shortcuts */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
              QUICK DEMO CREDENTIAL AUTO-FILL
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-amber-400 font-bold transition-all text-center"
              >
                ⚡ Auto-fill Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('USER')}
                className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-cyan-400 font-bold transition-all text-center"
              >
                ⚡ Auto-fill Citizen
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer System Telemetry */}
      <footer className="relative z-10 text-[10px] text-slate-500 font-mono pb-2 text-center">
        AI CITY GUARDIAN • AUTONOMOUS EMERGENCY INTELLIGENCE & DISPATCH PLATFORM
      </footer>
    </div>
  );
}
