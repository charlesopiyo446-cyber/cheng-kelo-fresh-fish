import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

export function Button({ className = '', variant = 'default', size = 'default', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-200 bg-white hover:bg-slate-100',
    ghost: 'hover:bg-slate-100',
  };
  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    icon: 'h-9 w-9',
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
