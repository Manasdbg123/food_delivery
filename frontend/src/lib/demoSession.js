// A local-only session for trying the app with no backend running. The token is
// unsigned, so the real gateway rejects it; the moment the backend is up, the first
// 401 signs the demo user out.
const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

export const demoToken = () => [
  b64({ alg: 'none', typ: 'JWT' }),
  b64({ sub: 'demo-user', email: 'demo@foodiehub.example', role: 'DEMO', exp: Math.floor(Date.now() / 1000) + 86400 }),
  'demo',
].join('.');
