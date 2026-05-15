import { Home, ShoppingBag, ShoppingCart, Package, Users, Settings, Fish } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'DASHBOARD', icon: Home, code: 'DSH' },
  { id: 'sales', label: 'SALES', icon: ShoppingCart, code: 'SAL' },
  { id: 'purchases', label: 'PURCHASES', icon: ShoppingBag, code: 'PRC' },
  { id: 'stock', label: 'STOCK', icon: Package, code: 'STK' },
  { id: 'users', label: 'USERS', icon: Users, code: 'USR' },
  { id: 'settings', label: 'SETTINGS', icon: Settings, code: 'SET' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-cyan-500/20 flex flex-col relative overflow-hidden">
      {/* Circuit board pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25 0 L25 25 M0 25 L25 25 M25 25 L50 25 M25 25 L25 50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-500"/>
              <circle cx="25" cy="25" r="2" fill="currentColor" className="text-cyan-500"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
           style={{background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.1) 2px, rgba(6,182,212,0.1) 4px)'}} />

      {/* Logo Section */}
      <div className="p-6 border-b border-cyan-500/20 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-cyan-400 flex items-center justify-center bg-slate-900 relative"
                 style={{clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)'}}>
              <Fish className="w-7 h-7 text-cyan-400" />
              {/* LED indicators */}
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
          </div>
          <div>
            <h1 className="text-cyan-400 font-bold text-lg tracking-[0.2em] font-mono">KELLO</h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] font-mono uppercase">Fish Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 px-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
          <span className="text-[10px] text-slate-600 font-mono tracking-wider">NAV</span>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
        </div>
        
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 relative group transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'border border-transparent hover:border-cyan-500/20 hover:bg-cyan-500/5'
                  }`}
                  style={{clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'}}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                  )}
                  
                  <div className={`w-10 h-10 border flex items-center justify-center ${
                    isActive 
                      ? 'border-cyan-400 bg-cyan-500/20' 
                      : 'border-slate-700 bg-slate-900 group-hover:border-cyan-500/50'
                  }`}
                  style={{clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))'}}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`font-mono text-sm tracking-wider ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {item.label}
                    </p>
                  </div>
                  
                  <div className={`text-[10px] font-mono px-2 py-0.5 border ${
                    isActive ? 'border-cyan-400 text-cyan-400' : 'border-slate-700 text-slate-600'
                  }`}>
                    {item.code}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">SYSTEM STATUS</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-600">VER:</span>
              <span className="text-cyan-400">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">NODE:</span>
              <span className="text-cyan-400">PRD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">UPTIME:</span>
              <span className="text-emerald-400">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">MODE:</span>
              <span className="text-amber-400">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}