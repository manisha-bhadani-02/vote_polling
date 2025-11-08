export const API_BASE = "http://localhost:4000/api";

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}
