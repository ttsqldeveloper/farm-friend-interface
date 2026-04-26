export const API_BASE = "https://farmwise-api-cauf.onrender.com";

const TOKEN_KEY = "farmwise_token";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers as Record<string, string> | undefined),
  };
  const token = auth.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export interface User {
  id: number;
  fullName?: string;
  full_name?: string;
  email: string;
  location?: string;
  cropTypes?: string[];
  crop_types?: string[];
}

export const api = {
  register: (body: { fullName: string; email: string; password: string; location?: string; cropTypes?: string[] }) =>
    request<{ token: string; user: User }>("/api/v1/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/api/v1/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<User | { user: User }>("/api/v1/me"),
  updateMe: (body: Partial<User>) => request<User>("/api/v1/me", { method: "PUT", body: JSON.stringify(body) }),
  deleteMe: () => request<{ ok: boolean }>("/api/v1/me", { method: "DELETE" }),
  predict: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<any>("/predict", { method: "POST", body: fd });
  },
  chat: (question: string) =>
    request<any>("/chat", { method: "POST", body: JSON.stringify({ question }) }),
  diagnoses: (limit = 20, offset = 0) =>
    request<{ items: any[] }>(`/api/v1/diagnoses?limit=${limit}&offset=${offset}`),
  chats: (limit = 20, offset = 0) =>
    request<{ items: any[] }>(`/api/v1/chats?limit=${limit}&offset=${offset}`),
  crops: (search?: string) =>
    request<{ items: any[] }>(`/api/v1/crops${search ? `?search=${encodeURIComponent(search)}` : ""}`),
};
