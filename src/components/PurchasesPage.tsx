import { useState, useEffect } from 'react';
import { Plus, Search, Package, X, Trash2 } from 'lucide-react';
import { purchasesApi, categoriesApi } from '../utils/api';
import { formatCurrency, getCategoryColor } from '../utils/helpers';

interface PurchasesPageProps { currentUser: any; }

export function PurchasesPage({ currentUser }: PurchasesPageProps) {
  const [purchases, setPurchases]   = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    fish_category_id: '', quantity: '', cost_price: '',
    supplier_name: '', invoice_number: '', notes: '',
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const load = () => {
    setLoading(true);
    Promise.all([purchasesApi.getAll(), categoriesApi.getAll()])
      .then(([p, c]) => { setPurchases(p); setCategories(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await purchasesApi.create({ ...form, created_by: currentUser.id });
      setShowForm(false);
      setForm({ fish_category_id: '', quantity: '', cost_price: '', supplier_name: '', invoice_number: '', notes: '', purchase_date: new Date().toISOString().split('T')[0] });
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this purchase?')) return;
    await purchasesApi.remove(id); load();
  };

  const filtered = purchases.filter(p =>
    p.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalCost = filtered.reduce((sum, p) => sum + Number(p.total_cost), 0);
  const clip = { clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' };
  const inp  = "w-full px-4 py-3 bg-slate-950 border border-slate-700 text-slate-300 text-sm font-mono focus:outline-none focus:border-sky-500/50 placeholder:text-slate-600";

  return (
    <div className="p-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(6,182,212,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" /><span className="text-[10px] font-mono text-slate-600 tracking-widest">MODULE ACTIVE</span></div>
            <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">PURCHASE TERMINAL</h1>
            <p className="text-slate-500 text-sm font-mono">Inventory acquisition system</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setError(''); }} className="flex items-center gap-2 px-6 py-3 border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-sm tracking-wider hover:bg-sky-500/20 transition-colors" style={clip}>
            <Plus className="w-4 h-4" /> NEW PURCHASE
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3"><Package className="w-4 h-4 text-sky-400" /><h2 className="text-sm font-mono text-slate-300 tracking-wider">NEW ACQUISITION</h2></div>
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
                  <input type="number" min="0" placeholder="0" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">PURCHASE DATE</label>
                  <input type="date" value={form.purchase_date} onChange={e => setForm({...form, purchase_date: e.target.value})} required className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">SUPPLIER</label>
                  <input type="text" placeholder="ENTER NAME" value={form.supplier_name} onChange={e => setForm({...form, supplier_name: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">INVOICE NO.</label>
                  <input type="text" placeholder="INV-0000" value={form.invoice_number} onChange={e => setForm({...form, invoice_number: e.target.value})} className={inp} style={clip} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-wider">NOTES</label>
                  <input type="text" placeholder="OPTIONAL NOTES" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inp} style={clip} />
                </div>
              </div>
              {form.quantity && form.cost_price && (
                <div className="p-3 border border-sky-500/20 bg-sky-950/20 flex items-center justify-between" style={clip}>
                  <span className="text-[10px] font-mono text-slate-500">TOTAL COST</span>
                  <span className="font-bold font-mono text-sky-400">{formatCurrency(Number(form.quantity) * Number(form.cost_price))}</span>
                </div>
              )}
              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-6 py-3 border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-sm tracking-wider hover:bg-sky-500/20 transition-colors disabled:opacity-50" style={clip}>
                  {submitting ? 'PROCESSING...' : 'PROCESS PURCHASE'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center border border-slate-700 bg-slate-950 max-w-lg">
          <div className="px-4 py-3 border-r border-slate-700"><Search className="w-4 h-4 text-slate-500" /></div>
          <input type="text" placeholder="SEARCH BY SUPPLIER OR INVOICE..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 bg-transparent text-slate-300 text-sm font-mono placeholder:text-slate-600 focus:outline-none" />
        </div>

        {/* Table */}
        <div className="border border-slate-800 bg-slate-900/50 overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))'}}>
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="grid grid-cols-12 gap-4 text-[10px] font-mono text-slate-500 tracking-wider">
              <div className="col-span-1">ID</div><div className="col-span-2">INVOICE</div><div className="col-span-2">CATEGORY</div>
              <div className="col-span-2">SUPPLIER</div><div className="col-span-1">QTY</div><div className="col-span-2">TOTAL COST</div>
              <div className="col-span-1">DATE</div><div className="col-span-1">ACT</div>
            </div>
          </div>
          {loading ? <div className="px-6 py-12 text-center text-[10px] font-mono text-slate-600 animate-pulse">LOADING DATA...</div> : (
            <div className="divide-y divide-slate-800">
              {filtered.map(p => {
                const cat = { name: p.category_name, description: '', unit_price: 0, id: p.fish_category_id, purchase_cost: null, is_active: true };
                return (
                  <div key={p.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1"><span className="text-sm font-mono text-slate-400">#{String(p.id).padStart(3,'0')}</span></div>
                      <div className="col-span-2"><span className="text-xs font-mono text-sky-400 border border-sky-500/30 px-2 py-1">{p.invoice_number||'—'}</span></div>
                      <div className="col-span-2"><div className={`w-10 h-10 border-2 ${getCategoryColor(cat)} flex items-center justify-center bg-slate-950`} style={clip}><span className="font-bold text-xs">{p.category_name}</span></div></div>
                      <div className="col-span-2"><p className="font-mono text-sm text-slate-300">{p.supplier_name||'N/A'}</p></div>
                      <div className="col-span-1"><p className="font-mono text-sm text-slate-300">{p.quantity}</p></div>
                      <div className="col-span-2"><p className="font-bold font-mono text-sky-400">{formatCurrency(Number(p.total_cost))}</p></div>
                      <div className="col-span-1"><p className="text-[10px] font-mono text-slate-500">{p.purchase_date}</p></div>
                      <div className="col-span-1">
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 border border-slate-700 flex items-center justify-center hover:border-rose-500/50 hover:text-rose-400 text-slate-500 transition-colors" style={clip}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">{filtered.length} RECORDS</span>
            <div className="flex items-center gap-4"><span className="text-[10px] font-mono text-slate-500">TOTAL COST:</span><span className="font-bold font-mono text-sky-400">{formatCurrency(totalCost)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
