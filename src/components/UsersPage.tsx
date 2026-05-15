import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Shield, User as UserIcon, X, Trash2 } from 'lucide-react';
import { usersApi } from '../utils/api';
import { formatDate } from '../utils/helpers';

export function UsersPage() {
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<any>(null);
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = { name: '', email: '', password: '', role: 'cashier', phone: '', is_active: 1 };
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    usersApi.getAll().then(setUsers).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit   = (u: any) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '', is_active: u.is_active });
    setError(''); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      const payload: any = { ...form };
      if (!payload.password) delete payload.password;
      if (editing) await usersApi.update(editing.id, payload);
      else         await usersApi.create(payload);
      setShowForm(false); load();
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await usersApi.remove(id); load();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleStyle: Record<string, string> = {
    admin:    'border-rose-500/50 text-rose-400 bg-rose-500/10',
    director: 'border-violet-500/50 text-violet-400 bg-violet-500/10',
    cashier:  'border-sky-500/50 text-sky-400 bg-sky-500/10',
    customer: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
  };

  const clip   = { clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' };
  const clipMd = { clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' };
  const inp    = "w-full px-4 py-3 bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono focus:outline-none focus:border-violet-500/50 placeholder:text-slate-600";

  return (
    <div className="p-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(6,182,212,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /><span className="text-[10px] font-mono text-slate-600 tracking-widest">MODULE ACTIVE</span></div>
            <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">USER REGISTRY</h1>
            <p className="text-slate-500 text-sm font-mono">System access and permissions management</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-sm tracking-wider hover:bg-violet-500/20 transition-colors" style={clip}>
            <Plus className="w-4 h-4" /> ADD USER
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-violet-400" /><h2 className="text-sm font-mono text-slate-300 tracking-wider">{editing ? 'EDIT USER' : 'NEW USER'}</h2></div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 transition-colors" style={clip}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-xs font-mono text-rose-400 border border-rose-500/30 bg-rose-500/10 px-4 py-3">{error.toUpperCase()}</p>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">FULL NAME</label>
                  <input type="text" placeholder="ENTER NAME" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">EMAIL</label>
                  <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">PASSWORD {editing && '(LEAVE BLANK TO KEEP)'}</label>
                  <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">ROLE</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inp} style={clip}>
                    <option value="admin">Admin</option>
                    <option value="director">Director</option>
                    <option value="cashier">Cashier</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">PHONE</label>
                  <input type="text" placeholder="07XXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">STATUS</label>
                  <select value={form.is_active} onChange={e => setForm({...form, is_active: Number(e.target.value)})} className={inp} style={clip}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-3 border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-sm tracking-wider hover:bg-violet-500/20 transition-colors disabled:opacity-50" style={clip}>
                  {submitting ? 'SAVING...' : editing ? 'UPDATE USER' : 'CREATE USER'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center border border-slate-700 bg-slate-950 max-w-lg">
          <div className="px-4 py-3 border-r border-slate-700"><Search className="w-4 h-4 text-slate-500" /></div>
          <input type="text" placeholder="SEARCH USERS..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none" />
          <div className="px-3 border-l border-slate-700"><span className="text-[10px] font-mono text-slate-600">{filtered.length} FOUND</span></div>
        </div>

        {/* Cards */}
        {loading ? <div className="text-center py-12 text-[10px] font-mono text-slate-600 animate-pulse">LOADING DATA...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(user => (
              <div key={user.id} className="border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-cyan-500/30 transition-all duration-300" style={clipMd}>
                <div className="h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 border-2 border-cyan-500/50 bg-slate-950 flex items-center justify-center relative" style={clip}>
                        {user.profile_picture
                          ? <img src={`http://localhost/chengkello/storage/${user.profile_picture}`} alt="" className="w-full h-full object-cover" />
                          : <UserIcon className="w-7 h-7 text-cyan-400" />}
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border border-slate-900 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-slate-200 tracking-wider">{user.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(user)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-cyan-500/50 hover:text-cyan-400 text-slate-500 transition-colors" style={clip}><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(user.id)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 hover:text-rose-400 text-slate-500 transition-colors" style={clip}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-xs tracking-wider ${roleStyle[user.role] ?? 'border-slate-700 text-slate-400'}`} style={clip}>
                      <Shield className="w-3 h-3" />{user.role.toUpperCase()}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-xs tracking-wider ${user.is_active ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}`} style={clip}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {user.phone && <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-600 tracking-wider">PHONE</span><span className="text-slate-400">{user.phone}</span></div>}
                    <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-600 tracking-wider">JOINED</span><span className="text-slate-400">{formatDate(user.created_at)}</span></div>
                    <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-600 tracking-wider">UID</span><span className="text-cyan-400">#{String(user.id).padStart(4,'0')}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
