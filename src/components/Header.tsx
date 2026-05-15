import { Bell, Search, User, LogOut, Radio } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-cyan-500/20 px-8 py-4 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
           style={{background: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(6,182,212,0.1) 1px, rgba(6,182,212,0.1) 2px)'}} />

      <div className="flex items-center justify-between relative">
        {/* Search */}
        <div className="flex items-center border border-slate-700 bg-slate-950 focus-within:border-cyan-500/50 transition-colors">
          <div className="px-4 py-3 border-r border-slate-700">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="SEARCH DATABASE..."
            className="px-4 py-3 bg-transparent w-72 text-slate-300 text-sm font-mono tracking-wider placeholder:text-slate-600 focus:outline-none"
          />
          <div className="px-3 py-2 border-l border-slate-700">
            <span className="text-[10px] font-mono text-slate-600 px-2 py-1 border border-slate-700">F1</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 border border-emerald-500/30 bg-emerald-500/10">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider">LIVE</span>
          </div>

          <button className="relative w-11 h-11 border border-slate-700 bg-slate-950 flex items-center justify-center hover:border-cyan-500/50 transition-colors group"
                  style={{clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))'}}>
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-700">
            <div className="text-right">
              <p className="text-sm font-mono text-slate-300 tracking-wider">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">{user.role}</p>
            </div>
            <div className="w-11 h-11 border-2 border-cyan-500 bg-slate-950 flex items-center justify-center"
                 style={{clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))'}}>
              {user.profile_picture
                ? <img src={`http://localhost/chengkello/storage/${user.profile_picture}`} alt="" className="w-full h-full object-cover" />
                : <User className="w-5 h-5 text-cyan-400" />}
            </div>
            <button onClick={onLogout}
                    className="w-9 h-9 border border-rose-500/30 bg-rose-500/10 flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                    style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}
                    title="Logout">
              <LogOut className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
