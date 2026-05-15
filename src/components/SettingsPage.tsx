import { User, Lock, Fish, Cpu, Edit, Save } from 'lucide-react';

export function SettingsPage() {
  const categories = [
    { name: 'M', desc: 'Medium', price: 'UGX 13,000' },
    { name: 'L', desc: 'Large', price: 'UGX 14,000' },
    { name: 'XL', desc: 'Extra Large', price: 'UGX 15,000' },
    { name: 'SXL', desc: 'Super Extra Large', price: 'UGX 16,500' },
  ];

  const sysInfo = [
    { label: 'VERSION', value: '1.0.0', color: 'text-cyan-400' },
    { label: 'DATABASE', value: 'cheng_kello', color: 'text-emerald-400' },
    { label: 'FRAMEWORK', value: 'Laravel + React', color: 'text-violet-400' },
    { label: 'LAST UPDATED', value: 'May 11, 2026', color: 'text-amber-400' },
  ];

  const inputCls = "w-full px-4 py-3 bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600";
  const clipSm = { clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' };
  const clipMd = { clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' };

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]"
           style={{backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      <div className="relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-600 tracking-widest">MODULE ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">SYSTEM CONFIG</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono">Account and system configuration panel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={clipMd}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
              <User className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono text-slate-300 tracking-wider">PROFILE SETTINGS</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { id: 'name', label: 'FULL NAME', type: 'text', value: 'OPIYO CHARLES WATMON' },
                { id: 'email', label: 'EMAIL ADDRESS', type: 'email', value: '[email]' },
                { id: 'phone', label: 'PHONE NUMBER', type: 'text', value: '[phone]' },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">{field.label}</label>
                  <input id={field.id} type={field.type} defaultValue={field.value}
                    className={inputCls} style={clipSm} />
                </div>
              ))}
              <button className="flex items-center gap-2 px-6 py-3 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-sm tracking-wider hover:bg-cyan-500/20 transition-colors mt-2"
                      style={clipSm}>
                <Save className="w-4 h-4" /> SAVE CHANGES
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={clipMd}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
              <Lock className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-mono text-slate-300 tracking-wider">PASSWORD SETTINGS</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { id: 'current', label: 'CURRENT PASSWORD', placeholder: 'ENTER CURRENT PASSWORD' },
                { id: 'new', label: 'NEW PASSWORD', placeholder: 'ENTER NEW PASSWORD' },
                { id: 'confirm', label: 'CONFIRM PASSWORD', placeholder: 'CONFIRM NEW PASSWORD' },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">{field.label}</label>
                  <input id={field.id} type="password" placeholder={field.placeholder}
                    className={inputCls} style={clipSm} />
                </div>
              ))}
              <button className="flex items-center gap-2 px-6 py-3 border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-sm tracking-wider hover:bg-violet-500/20 transition-colors mt-2"
                      style={clipSm}>
                <Lock className="w-4 h-4" /> UPDATE PASSWORD
              </button>
            </div>
          </div>

          {/* Fish Categories */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={clipMd}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
              <Fish className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono text-slate-300 tracking-wider">FISH CATEGORIES</h2>
            </div>
            <div className="p-6 space-y-3">
              {categories.map((cat) => (
                <div key={cat.name}
                     className="flex items-center justify-between p-4 border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 transition-colors"
                     style={clipSm}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border-2 border-cyan-500/50 bg-slate-900 flex items-center justify-center font-bold text-sm font-mono text-cyan-400"
                         style={clipSm}>
                      {cat.name}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-slate-300 tracking-wider">{cat.desc.toUpperCase()}</p>
                      <p className="text-[10px] font-mono text-slate-500">{cat.price}/UNIT</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-slate-700 text-slate-400 font-mono text-xs tracking-wider hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                          style={clipSm}>
                    <Edit className="w-3 h-3" /> EDIT
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* System Information */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={clipMd}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono text-slate-300 tracking-wider">SYSTEM INFORMATION</h2>
            </div>
            <div className="p-6 space-y-3">
              {sysInfo.map((item) => (
                <div key={item.label}
                     className="flex items-center justify-between p-4 border border-slate-800 bg-slate-950/50"
                     style={clipSm}>
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">{item.label}</span>
                  <span className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <div className="mt-4 p-4 border border-emerald-500/20 bg-emerald-950/20" style={clipSm}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 tracking-wider">ALL SYSTEMS OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
