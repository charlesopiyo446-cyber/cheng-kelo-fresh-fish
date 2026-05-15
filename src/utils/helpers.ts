import { FishCategory } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return num.toString().padStart(3, '0');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategoryColor = (category: FishCategory): string => {
  const colors: Record<string, string> = {
    'M': 'border-cyan-400 text-cyan-400',
    'L': 'border-emerald-400 text-emerald-400',
    'XL': 'border-amber-400 text-amber-400',
    'SXL': 'border-rose-400 text-rose-400'
  };
  return colors[category.name] || 'border-slate-400 text-slate-400';
};

export const getCategoryBg = (category: FishCategory): string => {
  const colors: Record<string, string> = {
    'M': 'bg-cyan-950/50 border-cyan-500/30',
    'L': 'bg-emerald-950/50 border-emerald-500/30',
    'XL': 'bg-amber-950/50 border-amber-500/30',
    'SXL': 'bg-rose-950/50 border-rose-500/30'
  };
  return colors[category.name] || 'bg-slate-950/50';
};

export const getCategoryAccent = (category: FishCategory): string => {
  const colors: Record<string, string> = {
    'M': 'cyan',
    'L': 'emerald',
    'XL': 'amber',
    'SXL': 'rose'
  };
  return colors[category.name] || 'slate';
};

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    'admin': 'border-rose-500 text-rose-400',
    'director': 'border-violet-500 text-violet-400',
    'cashier': 'border-sky-500 text-sky-400'
  };
  return colors[role] || 'border-slate-500 text-slate-400';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'approved': 'border-emerald-500 text-emerald-400',
    'pending': 'border-amber-500 text-amber-400',
    'rejected': 'border-rose-500 text-rose-400'
  };
  return colors[status] || 'border-slate-500 text-slate-400';
};