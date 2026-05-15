import { useState, useEffect } from 'react';
import { Plus, Search, Package, Check, Clock, XCircle, X, Trash2 } from 'lucide-react';
import { stocksApi, categoriesApi } from '../utils/api';
import { formatCurrency, getCategoryColor, getStatusColor } from '../utils/helpers';

interface StockPageProps { currentUser: any; }

export function StockPage({ currentUser }: StockPageProps) {
  const [stocks, setStocks]         = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    fish_category_id: '', quantity: '', cost_price: '',
    notes: '', stock_date: new Date().toISOString().split('T')[0],
  });

  const load = () => {
    setLoading(true);
    Promise.all([stocksApi.getAll(), categoriesApi.getAll()])
      .then(([s, c]) => { setStocks(s); setCategories(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await stocksApi.create({ ...form, added_by: currentUser.id });
      setShowForm(false);
      setForm({ fish_category_id: '', quantity: '', cost_price: '', notes: '', stock_date: new Date().toISOString().split('T')[0] });
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async (id: number) => {
    await stocksApi.approve(id, currentUser.id); load();
  };
  const handleReject = async (id: number) => {
    await stocksApi.reject(id, currentUser.id); load();
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this stock record?')) return;
    await stocksApi.remove(id); load();
  };

  const filtered = stocks.filter(s => {
    const matchSearch = s.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.added_by_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    approved: stocks.filter(s => s.status === 'approved').length,
    pending:  stocks.filter(s => s.status === 'pending').length,
    rejected: stocks.filter(s => s.status === 'rejected').length,
  };

  const clip = { clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' };
  const inp  = "w-full px-4 py-3 bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono focus:outline-none focus:border-amber-500/50 placeholder:text-slate-600";
  const isAdmin = ['admin','director'].includes(currentUser.role);

  return (
    <div className="p-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(6,182,212,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /><span className="text-[10px] font-mono text-slate-600 tracking-widest">MODULE ACTIVE</span></div>
            <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">INVENTORY CONTROL</h1>
            <p className="text-slate-500 text-sm font-mono">Stock management system</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setError(''); }} className="flex items-center gap-2 px-6 py-3 border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-sm tracking-wider hover:bg-amber-500/20 transition-colors" style={clip}>
            <Plus className="w-4 h-4" /> ADD STOCK
          </button>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL', value: stocks.length, color: 'border-slate-800 text-slate-200', icon: Package, iconColor: 'text-amber-400', key: 'all' },
            { label: 'APPROVED', value: counts.approved, color: 'border-emerald-500/30 text-emerald-400', icon: Check, iconColor: 'text-emerald-400', key: 'approved' },
            { label: 'PENDING',  value: counts.pending,  color: 'border-amber-500/30 text-amber-400',   icon: Clock, iconColor: 'text-amber-400',   key: 'pending' },
            { label: 'REJECTED', value: counts.rejected, color: 'border-rose-500/30 text-rose-400',     icon: XCircle, iconColor: 'text-rose-400', key: 'rejected' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.key} onClick={() => setFilterStatus(filterStatus === card.key ? 'all' : card.key)}
                   className={`border ${card.color} bg-slate-900/50 p-4 cursor-pointer hover:opacity-80 transition-opacity ${filterStatus === card.key ? 'ring-1 ring-cyan-500/30' : ''}`}
                   style={{clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-slate-700 bg-slate-800 flex items-center justify-center" style={clip}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 tracking-wider">{card.label}</p>
                    <p className={`text-xl font-bold font-mono ${card.color.split(' ')[1]}`}>{card.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3"><Package className="w-4 h-4 text-amber-400" /><h2 className="text-sm font-mono text-slate-300 tracking-wider">ADD STOCK ENTRY</h2></div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 transition-colors" style={clip}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-xs font-mono text-rose-400 border border-rose-500/30 bg-rose-500/10 px-4 py-3">{error.toUpperCase()}</p>}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">CATEGORY</label>
                  <select value={form.fish_category_id} onChange={e => setForm({...form, fish_category_id: e.target.value})} required className={inp} style={clip}>
                    <option value="">SELECT CATEGORY</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name} — {c.description}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">QUANTITY</label>
                  <input type="number" min="1" placeholder="000" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">COST PRICE / UNIT</label>
                  <input type="number" min="0" placeholder="0" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">STOCK DATE</label>
                  <input type="date" value={form.stock_date} onChange={e => setForm({...form, stock_date: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2 md:col-span-4">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">NOTES</label>
                  <input type="text" placeholder="OPTIONAL NOTES" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inp} style={clip} />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-3 border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-sm tracking-wider hover:bg-amber-500/20 transition-colors disabled:opacity-50" style={clip}>
                  {submitting ? 'SAVING...' : 'ADD STOCK'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center border border-slate-700 bg-slate-950 max-w-lg">
          <div className="px-4 py-3 border-r border-slate-700"><Search className="w-4 h-4 text-slate-500" /></div>
          <input type="text" placeholder="SEARCH INVENTORY..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))'}}>
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="grid grid-cols-12 gap-4 text-[10px] font-mono text-slate-500 tracking-wider">
              <div className="col-span-1">ID</div><div className="col-span-2">CATEGORY</div><div className="col-span-1">QTY</div>
              <div className="col-span-2">COST</div><div className="col-span-2">ADDED BY</div><div className="col-span-2">STATUS</div>
              <div className="col-span-2">ACTIONS</div>
            </div>
          </div>
          {loading ? <div className="px-6 py-12 text-center text-[10px] font-mono text-slate-600 animate-pulse">LOADING DATA...</div> : (
            <div className="divide-y divide-slate-800">
              {filtered.map(stock => {
                const cat = { name: stock.category_name, description: '', unit_price: 0, id: stock.fish_category_id, purchase_cost: null, is_active: true };
                return (
                  <div key={stock.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1"><span className="text-sm font-mono text-slate-400">#{String(stock.id).padStart(3,'0')}</span></div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 border-2 ${getCategoryColor(cat)} flex items-center justify-center bg-slate-950`} style={clip}><span className="font-bold text-xs">{stock.category_name}</span></div>
                          <p className="font-mono text-xs text-slate-400">{stock.category_description}</p>
                        </div>
                      </div>
                      <div className="col-span-1"><p className="font-mono text-sm text-slate-300">{stock.quantity}</p></div>
                      <div className="col-span-2"><p className="font-mono text-sm text-slate-300">{stock.cost_price ? formatCurrency(Number(stock.cost_price)) : '—'}</p></div>
                      <div className="col-span-2"><p className="font-mono text-sm text-slate-300">{stock.added_by_name?.split(' ')[0]}</p><p className="text-[10px] font-mono text-slate-500">{stock.stock_date}</p></div>
                      <div className="col-span-2"><span className={`px-2 py-1 border text-[10px] font-mono ${getStatusColor(stock.status)}`}>{stock.status.toUpperCase()}</span></div>
                      <div className="col-span-2 flex items-center gap-2">
                        {isAdmin && stock.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(stock.id)} className="w-8 h-8 border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 text-emerald-400 transition-colors" style={clip} title="Approve"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleReject(stock.id)} className="w-8 h-8 border border-rose-500/30 bg-rose-500/10 flex items-center justify-center hover:bg-rose-500/20 text-rose-400 transition-colors" style={clip} title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        <button onClick={() => handleDelete(stock.id)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 hover:text-rose-400 text-slate-500 transition-colors" style={clip}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">{filtered.length} RECORDS</span>
            <span className="text-[10px] font-mono text-slate-500">FILTER: <span className="text-amber-400">{filterStatus.toUpperCase()}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
