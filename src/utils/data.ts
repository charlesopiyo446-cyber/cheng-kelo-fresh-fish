import { User, FishCategory, Stock, Sale, Purchase } from '../types';

export const users: User[] = [
  {
    id: 4,
    name: 'OPIYO CHARLES WATMON',
    email: 'charlesopiyo446@gmail.com',
    role: 'admin',
    phone: '0782621870',
    address: null,
    is_active: true,
    profile_picture: null,
    created_at: '2026-05-11 14:26:54'
  },
  {
    id: 5,
    name: 'OTIM FRED',
    email: 'fred@gmail.com',
    role: 'cashier',
    phone: '0777981262',
    address: null,
    is_active: true,
    profile_picture: null,
    created_at: '2026-05-11 15:23:03'
  },
  {
    id: 6,
    name: 'OPIYO ISAAC',
    email: 'isaac@fresfish.com',
    role: 'director',
    phone: '0786366197',
    address: null,
    is_active: true,
    profile_picture: '1778530602_isaac.jpg',
    created_at: '2026-05-11 17:06:20'
  }
];

export const fishCategories: FishCategory[] = [
  { id: 1, name: 'M', description: 'Medium', unit_price: 13000, purchase_cost: 10000, is_active: true },
  { id: 2, name: 'L', description: 'Large', unit_price: 14000, purchase_cost: 10000, is_active: true },
  { id: 3, name: 'XL', description: 'Extra Large', unit_price: 15000, purchase_cost: 11000, is_active: true },
  { id: 4, name: 'SXL', description: 'Super Extra Large', unit_price: 16500, purchase_cost: 12000, is_active: true }
];

export const stocks: Stock[] = [
  {
    id: 1,
    fish_category_id: 1,
    fish_category: fishCategories[0],
    quantity: 50,
    cost_price: 10000,
    stock_date: '2026-05-11',
    status: 'approved',
    added_by: 4,
    added_by_user: users[0],
    approved_by: 4,
    approved_by_user: users[0],
    approved_at: '2026-05-11 15:10:17',
    notes: 'From Purchase: opiyo'
  },
  {
    id: 2,
    fish_category_id: 2,
    fish_category: fishCategories[1],
    quantity: 60,
    cost_price: 10000,
    stock_date: '2026-05-11',
    status: 'approved',
    added_by: 4,
    added_by_user: users[0],
    approved_by: 4,
    approved_by_user: users[0],
    approved_at: '2026-05-11 15:17:28',
    notes: 'From Purchase:'
  },
  {
    id: 3,
    fish_category_id: 3,
    fish_category: fishCategories[2],
    quantity: 40,
    cost_price: 11000,
    stock_date: '2026-05-10',
    status: 'pending',
    added_by: 5,
    added_by_user: users[1],
    approved_by: null,
    approved_by_user: undefined,
    approved_at: null,
    notes: 'Awaiting approval'
  }
];

export const sales: Sale[] = [
  {
    id: 1,
    fish_category_id: 1,
    fish_category: fishCategories[0],
    quantity: 21,
    unit_price: 13000,
    total_amount: 273000,
    sold_by: 4,
    sold_by_user: users[0],
    sale_date: '2026-05-11',
    customer_name: 'ACEN',
    customer_phone: '0782621870',
    notes: 'paid'
  },
  {
    id: 2,
    fish_category_id: 2,
    fish_category: fishCategories[1],
    quantity: 12,
    unit_price: 14000,
    total_amount: 168000,
    sold_by: 5,
    sold_by_user: users[1],
    sale_date: '2026-05-11',
    customer_name: 'OPIYO',
    customer_phone: '0791942229',
    notes: 'paid'
  },
  {
    id: 3,
    fish_category_id: 1,
    fish_category: fishCategories[0],
    quantity: 12,
    unit_price: 13000,
    total_amount: 156000,
    sold_by: 5,
    sold_by_user: users[1],
    sale_date: '2026-05-11',
    customer_name: 'ACEN',
    customer_phone: '0782621870',
    notes: null
  },
  {
    id: 4,
    fish_category_id: 3,
    fish_category: fishCategories[2],
    quantity: 8,
    unit_price: 15000,
    total_amount: 120000,
    sold_by: 4,
    sold_by_user: users[0],
    sale_date: '2026-05-10',
    customer_name: 'OTIM',
    customer_phone: '0777123456',
    notes: 'credit'
  }
];

export const purchases: Purchase[] = [
  {
    id: 2,
    fish_category_id: 2,
    fish_category: fishCategories[1],
    quantity: 60,
    cost_price: 10000,
    total_cost: 600000,
    created_by: 4,
    created_by_user: users[0],
    purchase_date: '2026-05-11',
    supplier_name: 'LAKE VENDOR',
    invoice_number: 'INV-2026-0001',
    notes: 'well'
  },
  {
    id: 3,
    fish_category_id: 3,
    fish_category: fishCategories[2],
    quantity: 40,
    cost_price: 11000,
    total_cost: 440000,
    created_by: 4,
    created_by_user: users[0],
    purchase_date: '2026-05-11',
    supplier_name: 'OTIM',
    invoice_number: 'INV-2026-0002',
    notes: 'done'
  }
];

export const getStockByCategory = (categoryId: number): number => {
  const totalIn = stocks
    .filter(s => s.fish_category_id === categoryId && s.status === 'approved')
    .reduce((sum, s) => sum + s.quantity, 0);
  const totalOut = sales
    .filter(s => s.fish_category_id === categoryId)
    .reduce((sum, s) => sum + s.quantity, 0);
  return totalIn - totalOut;
};