import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Package, ShoppingCart, Users, Activity, Cpu, Database, Zap } from 'lucide-react';
import { salesApi, purchasesApi, stocksApi, categoriesApi, usersApi } from '../utils/api';
import { formatCurrency, formatNumber, getCategoryColor, getCategoryBg } from '../utils/helpers';

export function Dashboard() {
  const [sales, setSales]           = useState<any[]>([]);
  const [purchases, setPurchases]   = useState<any[]>([]);
  const [stocks, setStocks]         = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      salesApi.getAll(),
      purchasesApi.getAll(),
      stocksApi.getAll(),
      categoriesApi.getAll(),
      usersApi.getAll(),
    ]).then(([s, p, st, c, u]) => {
      setSales(s); setPurchases(p); setStocks(st); setCategories(c); setUsers(u);
    }).finally(() => setLoading(false));
  }, []);

  const totalSales     = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.total_cost), 0);
  const totalSold      = sales.reduce((sum, s) => sum + Number(s.quantity), 0);
  const approvedStock  = stocks.filter(s => s.status === 'approved').reduce((sum, s) => sum + Number(s.quantity), 0);
  const profit         = totalSales - totalPurchases;

  const getStockByCategory = (catId: number) => {
    const inStock = stocks.filter(s => s.fish_category_id == catId && s.status === 'approved').reduce((sum, s) => sum + Number(s.quantity), 0);
    const sold    = sales.filter(s => s.fish_category_id == catId).reduce((sum, s) => sum + Number(s.quantity), 0);
    return inStock - sold;
  };

  const stats = [
    { title: 'TOTAL REVENUE', value: formatCurrency(totalSales),     change: '+12.5%', trend: 'up',      icon: DollarSign,  code: 'REV' },
    { title: 'PURCHASES',     value: formatCurrency(totalPurchases),  change: '+8.2%',  trend: 'up',      icon: ShoppingCart, code: 'PRC' },
    { title: 'STOCK UNITS',   value: `${approvedStock - totalSold}`,  change: `${totalSold} SOLD`, trend: 'neutral', icon: Package, code: 'STK' },
    { title: 'ACTIVE USERS',  value: `${users.length}`,               change: 'ALL ROLES', trend: 'neutral', icon: Users, code: 'USR' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-mono text-slate-500 tracking-widest">LOADING DATA...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen relative">
      <div className="absolute inset-0 opacity-[0.03]"
           style={{backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-600 tracking-widest">SYSTEM ACTIVE</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-200 tracking-wider font-mono">CONTROL PANEL</h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">Real-time monitoring dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-600">LAST SYNC</p>
              <p className="text-sm font-mono text-cyan-400">{new Date().toLocaleTimeString()}</p>
            </div>
            <button className="w-10 h-10 border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                    style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
              <Zap className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="relative border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
                   style={{clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'}}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-600" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-600" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 border border-slate-700 bg-slate-800 flex items-center justify-center"
                         style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 border border-slate-700 px-2 py-0.5">{stat.code}</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">{stat.title}</p>
                  <p className="text-xl font-bold text-slate-200 font-mono tracking-wider">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-1 px-2 py-1 border ${stat.trend === 'up' ? 'border-emerald-500/30 text-emerald-400' : 'border-slate-700 text-slate-500'}`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      <span className="text-[10px] font-mono">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Inventory Levels */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden"
               style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono text-slate-300 tracking-wider">INVENTORY LEVELS</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-600 border border-slate-700 px-2 py-0.5">REAL-TIME</span>
            </div>
            <div className="p-6 space-y-3">
              {categories.map((cat) => {
                const available = getStockByCategory(cat.id);
                const pct = Math.min(Math.max((available / 100) * 100, 0), 100);
                const fakeCategory = { name: cat.name, description: cat.description, unit_price: cat.unit_price, id: cat.id, purchase_cost: cat.purchase_cost, is_active: cat.is_active };
                return (
                  <div key={cat.id} className={`border ${getCategoryBg(fakeCategory)} p-4`}
                       style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 border-2 ${getCategoryColor(fakeCategory)} flex items-center justify-center bg-slate-950`}
                             style={{clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'}}>
                          <span className="font-bold text-sm">{cat.name}</span>
                        </div>
                        <div>
                          <p className="font-mono text-sm text-slate-300 tracking-wider">{cat.description}</p>
                          <p className="text-[10px] font-mono text-slate-500">{formatCurrency(Number(cat.unit_price))}/UNIT</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-mono text-slate-200">{formatNumber(available)}</p>
                        <p className="text-[10px] font-mono text-slate-500">UNITS</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-500 transition-all duration-500" style={{width: `${pct}%`}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction Log */}
          <div className="border border-slate-800 bg-slate-900/50 overflow-hidden"
               style={{clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))'}}>
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-mono text-slate-300 tracking-wider">TRANSACTION LOG</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5">LIVE</span>
            </div>
            <div className="p-4 space-y-2">
              {sales.slice(0, 6).map((sale) => {
                const cat = { name: sale.category_name, description: sale.category_description, unit_price: 0, id: sale.fish_category_id, purchase_cost: null, is_active: true };
                return (
                  <div key={sale.id} className="flex items-center justify-between p-3 border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 transition-colors"
                       style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border-2 ${getCategoryColor(cat)} flex items-center justify-center bg-slate-950`}
                           style={{clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'}}>
                        <span className="font-bold text-xs">{sale.category_name}</span>
                      </div>
                      <div>
                        <p className="font-mono text-sm text-slate-300">{sale.customer_name || 'WALK-IN'}</p>
                        <p className="text-[10px] font-mono text-slate-500">{sale.quantity} UNITS • {sale.sold_by_name?.split(' ')[0]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-emerald-400">{formatCurrency(Number(sale.total_amount))}</p>
                      <p className="text-[10px] font-mono text-slate-600">{sale.sale_date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profit */}
        <div className="border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-950 p-6 relative overflow-hidden"
             style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
          <div className="absolute top-0 right-0 w-32 h-32 border border-emerald-500/10" />
          <div className="absolute top-4 right-4 w-24 h-24 border border-emerald-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 tracking-widest">PROFIT ANALYSIS</span>
              </div>
              <p className="text-3xl font-bold text-slate-200 font-mono tracking-wider">{formatCurrency(profit)}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-mono text-emerald-400">REVENUE - PURCHASES</span>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center"
                 style={{clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'}}>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
