import { useState } from 'react';
import { Fish, Lock, Mail, AlertCircle } from 'lucide-react';
import { authApi } from '../utils/api';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('ck_user', JSON.stringify(res.user));
      onLogin(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const clip = { clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 border-2 border-cyan-400 bg-slate-900 flex items-center justify-center mb-4 relative"
               style={{clipPath: 'polygon(0 15%, 15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%)'}}>
            <Fish className="w-10 h-10 text-cyan-400" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold font-mono text-cyan-400 tracking-[0.3em]">KELLO</h1>
          <p className="text-slate-500 text-xs font-mono tracking-[0.4em] mt-1">FRESH FISH MANAGEMENT</p>
        </div>

        {/* Card */}
        <div className="border border-slate-800 bg-slate-900/80 backdrop-blur-sm overflow-hidden"
             style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
          {/* Card header */}
          <div className="px-8 py-5 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 tracking-widest">AUTHENTICATION REQUIRED</span>
            </div>
            <h2 className="text-lg font-mono text-slate-200 tracking-wider mt-1">SYSTEM LOGIN</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3 border border-rose-500/30 bg-rose-500/10"
                   style={clip}>
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-mono text-rose-400">{error.toUpperCase()}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider">EMAIL ADDRESS</label>
              <div className="flex items-center border border-slate-700 bg-slate-950 focus-within:border-cyan-500/50 transition-colors">
                <div className="px-4 py-3 border-r border-slate-700">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL"
                  required
                  className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 tracking-wider">PASSWORD</label>
              <div className="flex items-center border border-slate-700 bg-slate-950 focus-within:border-cyan-500/50 transition-colors">
                <div className="px-4 py-3 border-r border-slate-700">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="ENTER PASSWORD"
                  required
                  className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-mono text-sm tracking-widest hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={clip}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-slate-700 mt-6 tracking-wider">
          CHENG KELLO FRESH FISH © 2026 — v1.0.0
        </p>
      </div>
    </div>
  );
}
