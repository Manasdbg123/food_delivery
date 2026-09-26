// One place that talks to the API gateway: attaches the session token, turns error
// bodies into readable messages, and tells the app when a session has expired.

const TOKEN_KEY = 'token';
// Empty means same origin: the Vite dev proxy or the production nginx forwards /api.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, { offline = false } = {}) {
    super(message);
    this.status = status;
    this.offline = offline;
  }
}

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

export async function api(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}/api/v1${path}`, {
      method, headers, signal, body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server.', 0, { offline: true });
  }

  const data = await res.json().catch(() => null);
  if (res.ok) return data;

  if (res.status === 401 && token) window.dispatchEvent(new Event('auth:expired'));
  // Every service answers errors with a JSON body. A 5xx with no body comes from a
  // proxy (Vite's dev server, nginx) that could not reach the gateway at all.
  const offline = res.status >= 500 && data === null;
  throw new ApiError(
    data?.message || (offline ? 'The server is unavailable.' : `Request failed (${res.status}).`),
    res.status,
    { offline },
  );
}

// Decode a JWT payload for display. The gateway verifies the signature; the client
// only reads who the token says it belongs to.
export function readToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { id: payload.sub, email: payload.email, role: payload.role, exp: payload.exp };
  } catch {
    return null;
  }
}
