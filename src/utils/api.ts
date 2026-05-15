const BASE_URL = 'http://localhost/chengkello/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: any }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ── Users ────────────────────────────────────────────────────
export const usersApi = {
  getAll:  (role?: string)  => request<any[]>(`/users${role ? `?role=${role}` : ''}`),
  getOne:  (id: number)     => request<any>(`/users/${id}`),
  create:  (data: any)      => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: number, data: any) => request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove:  (id: number)     => request<any>(`/users/${id}`, { method: 'DELETE' }),
};

// ── Fish Categories ──────────────────────────────────────────
export const categoriesApi = {
  getAll:  (activeOnly?: boolean) => request<any[]>(`/fish_categories${activeOnly ? '?active=1' : ''}`),
  getOne:  (id: number)           => request<any>(`/fish_categories/${id}`),
  create:  (data: any)            => request<any>('/fish_categories', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: number, data: any) => request<any>(`/fish_categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove:  (id: number)           => request<any>(`/fish_categories/${id}`, { method: 'DELETE' }),
};

// ── Stocks ───────────────────────────────────────────────────
export const stocksApi = {
  getAll:   (status?: string, category?: number) =>
    request<any[]>(`/stocks${status ? `?status=${status}` : ''}${category ? `&category=${category}` : ''}`),
  getOne:   (id: number) => request<any>(`/stocks/${id}`),
  create:   (data: any)  => request<any>('/stocks', { method: 'POST', body: JSON.stringify(data) }),
  update:   (id: number, data: any) => request<any>(`/stocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  approve:  (id: number, approved_by: number) =>
    request<any>(`/stocks/${id}`, { method: 'PUT', body: JSON.stringify({ action: 'approve', approved_by }) }),
  reject:   (id: number, approved_by: number) =>
    request<any>(`/stocks/${id}`, { method: 'PUT', body: JSON.stringify({ action: 'reject', approved_by }) }),
  remove:   (id: number) => request<any>(`/stocks/${id}`, { method: 'DELETE' }),
};

// ── Sales ────────────────────────────────────────────────────
export const salesApi = {
  getAll:  () => request<any[]>('/sales'),
  getOne:  (id: number) => request<any>(`/sales/${id}`),
  create:  (data: any)  => request<any>('/sales', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: number, data: any) => request<any>(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove:  (id: number) => request<any>(`/sales/${id}`, { method: 'DELETE' }),
};

// ── Purchases ────────────────────────────────────────────────
export const purchasesApi = {
  getAll:  () => request<any[]>('/purchases'),
  getOne:  (id: number) => request<any>(`/purchases/${id}`),
  create:  (data: any)  => request<any>('/purchases', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: number, data: any) => request<any>(`/purchases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove:  (id: number) => request<any>(`/purchases/${id}`, { method: 'DELETE' }),
};
