import { useState, useEffect } from 'react';
import { Plus, Search, ShoppingCart, X, Trash2 } from 'lucide-react';
import { salesApi, categoriesApi } from '../utils/api';
import { formatCurrency, getCategoryColor } from '../utils/helpers';

interface SalesPageProps { currentUser: any; }

export function SalesPage({ currentUser }: SalesPageProps) {
  const [sales, setSales]           = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    fish_category_id: '', quantity: '', customer_name: '',
    customer_phone: '', notes: '', sale_date: new Date().toISOString().split('T')[0],
  });

  const load = () => {
    setLoading(true);
    Promise.all([salesApi.getAll(), categoriesApi.getAll(true)])
      .then(([s, c]) => { setSales(s); setCategories(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const selectedCat = categories.find(c => c.id == form.fish_category_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await salesApi.create({ ...form, unit_price: selectedCat?.unit_price ?? 0, sold_by: currentUser.id });
      setShowForm(false);
      setForm({ fish_category_id: '', quantity: '', customer_name: '', customer_phone: '', notes: '', sale_date: new Date().toISOString().split('T')[0] });
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sale?')) return;
    await salesApi.remove(id); load();
  };

  const filtered = sales.filter(s =>
    s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalAmount = filtered.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const clip = { clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' };
  const inp  = "w-full px-4 py-3 bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600";

  return (
    <div className="p-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(6,182,212,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] font-mono text-slate-600 tracking-widest">MODULE ACTIVE</span></div>
            <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">SALES TERMINAL</h1>
            <p className="text-slate-500 text-sm font-mono">Transaction management system</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setError(''); }} className="flex items-center gap-2 px-6 py-3 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-sm tracking-wider hover:bg-cyan-500/20 transition-colors" style={clip}>
            <Plus className="w-4 h-4" /> NEW SALE
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3"><ShoppingCart className="w-4 h-4 text-cyan-400" /><h2 className="text-sm font-mono text-slate-300 tracking-wider">NEW TRANSACTION</h2></div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 transition-colors" style={clip}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-xs font-mono text-rose-400 border border-rose-500/30 bg-rose-500/10 px-4 py-3">{error.toUpperCase()}</p>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">CATEGORY</label>
                  <select value={form.fish_category_id} onChange={e => setForm({...form, fish_category_id: e.target.value})} required className={inp} style={clip}>
                    <option value="">SELECT CATEGORY</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name} — {c.description} (USh {Number(c.unit_price).toLocaleString()})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">QUANTITY</label>
                  <input type="number" min="1" placeholder="000" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">SALE DATE</label>
                  <input type="date" value={form.sale_date} onChange={e => setForm({...form, sale_date: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">CUSTOMER NAME</label>
                  <input type="text" placeholder="ENTER NAME" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">CUSTOMER PHONE</label>
                  <input type="text" placeholder="07XXXXXXXX" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">NOTES</label>
                  <input type="text" placeholder="paid / credit" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inp} style={clip} />
                </div>
              </div>
              {selectedCat && form.quantity && (
                <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between" style={clip}>
                  <span className="text-[10px] font-mono text-slate-500">TOTAL AMOUNT</span>
                  <span className="font-bold font-mono text-emerald-400">{formatCurrency(Number(form.quantity) * Number(selectedCat.unit_price))}</span>
                </div>
              )}
              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-sm tracking-wider hover:bg-emerald-500/20 transition-colors disabled:opacity-50" style={clip}>
                  {submitting ? 'PROCESSING...' : 'PROCESS SALE'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center border border-slate-700 bg-slate-950">
            <div className="px-4 py-3 border-r border-slate-700"><Search className="w-4 h-4 text-slate-500" /></div>
            <input type="text" placeholder="SEARCH TRANSACTIONS..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none" />
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))'}}>
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="grid grid-cols-12 gap-4 text-[10px] font-mono text-slate-500 tracking-wider">
              <div className="col-span-1">ID</div><div className="col-span-2">CATEGORY</div><div className="col-span-2">CUSTOMER</div>
              <div className="col-span-1">QTY</div><div className="col-span-2">AMOUNT</div><div className="col-span-2">STATUS</div>
              <div className="col-span-1">DATE</div><div className="col-span-1">ACT</div>
            </div>
          </div>
          {loading ? <div className="px-6 py-12 text-center text-[10px] font-mono text-slate-600 animate-pulse">LOADING DATA...</div> : (
            <div className="divide-y divide-slate-800">
              {filtered.map(sale => {
                const cat = { name: sale.category_name, description: '', unit_price: 0, id: sale.fish_category_id, purchase_cost: null, is_active: true };
                return (
                  <div key={sale.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1"><span className="text-sm font-mono text-slate-400">#{String(sale.id).padStart(3,'0')}</span></div>
                      <div className="col-span-2"><div className={`w-10 h-10 border-2 ${getCategoryColor(cat)} flex items-center justify-center bg-slate-950`} style={clip}><span className="font-bold text-xs">{sale.category_name}</span></div></div>
                      <div className="col-span-2"><p className="font-mono text-sm text-slate-300">{sale.customer_name||'—'}</p><p className="text-[10px] font-mono text-slate-500">{sale.customer_phone}</p></div>
                      <div className="col-span-1"><p className="font-mono text-sm text-slate-300">{sale.quantity}</p></div>
                      <div className="col-span-2"><p className="font-bold font-mono text-emerald-400">{formatCurrency(Number(sale.total_amount))}</p></div>
                      <div className="col-span-2"><span className="px-2 py-1 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">{sale.notes?.toUpperCase()||'PENDING'}</span></div>
                      <div className="col-span-1"><p className="text-[10px] font-mono text-slate-500">{sale.sale_date}</p></div>
                      <div className="col-span-1">
                        <button onClick={() => handleDelete(sale.id)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 hover:text-rose-400 text-slate-500 transition-colors" style={clip}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">{filtered.length} RECORDS</span>
            <div className="flex items-center gap-4"><span className="text-[10px] font-mono text-slate-500">TOTAL:</span><span className="font-bold font-mono text-emerald-400">{formatCurrency(totalAmount)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
