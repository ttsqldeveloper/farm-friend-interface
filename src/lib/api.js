export const API_BASE = "https://farmwise-api-cauf.onrender.com";

const TOKEN_KEY = "farmwise_token";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

async function request(path, opts = {}) {
  const headers = {
    ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...opts.headers
  };
  const token = auth.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data = null;
  try {data = text ? JSON.parse(text) : null;} catch {data = text;}
  if (!res.ok) {
    const msg = data && (data.message || data.error) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}











export const api = {
  register: (body) =>
  request("/api/v1/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
  request("/api/v1/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/v1/me"),
  updateMe: (body) => request("/api/v1/me", { method: "PUT", body: JSON.stringify(body) }),
  deleteMe: () => request("/api/v1/me", { method: "DELETE" }),
  predict: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/predict", { method: "POST", body: fd });
  },
  chat: (question) =>
  request("/chat", { method: "POST", body: JSON.stringify({ question }) }),
  diagnoses: (limit = 20, offset = 0) =>
  request(`/api/v1/diagnoses?limit=${limit}&offset=${offset}`),
  chats: (limit = 20, offset = 0) =>
  request(`/api/v1/chats?limit=${limit}&offset=${offset}`),
  crops: (search) =>
  request(`/api/v1/crops${search ? `?search=${encodeURIComponent(search)}` : ""}`)
};