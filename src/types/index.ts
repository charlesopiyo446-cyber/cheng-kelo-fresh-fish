export type UserRole = 'admin' | 'director' | 'cashier';
export type StockStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  profile_picture: string | null;
  created_at: string;
}

export interface FishCategory {
  id: number;
  name: string;
  description: string | null;
  unit_price: number;
  purchase_cost: number | null;
  is_active: boolean;
}

export interface Stock {
  id: number;
  fish_category_id: number;
  fish_category?: FishCategory;
  quantity: number;
  cost_price: number | null;
  stock_date: string;
  status: StockStatus;
  added_by: number;
  added_by_user?: User;
  approved_by: number | null;
  approved_by_user?: User;
  approved_at: string | null;
  notes: string | null;
}

export interface Sale {
  id: number;
  fish_category_id: number;
  fish_category?: FishCategory;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sold_by: number;
  sold_by_user?: User;
  sale_date: string;
  customer_name: string | null;
  customer_phone: string | null;
  notes: string | null;
}

export interface Purchase {
  id: number;
  fish_category_id: number;
  fish_category?: FishCategory;
  quantity: number;
  cost_price: number;
  total_cost: number;
  created_by: number;
  created_by_user?: User;
  purchase_date: string;
  supplier_name: string | null;
  invoice_number: string | null;
  notes: string | null;
}