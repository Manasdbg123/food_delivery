import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import { demoToken } from '../lib/demoSession';
import AuthLayout from './AuthLayout';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const next = location.state?.from?.pathname || '/';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: form, auth: false });
      login(data.token, data.user || { email: form.email });
      showToast(`Welcome back${data.user?.firstName ? `, ${data.user.firstName}` : ''}!`, 'success');
      navigate(next, { replace: true });
    } catch (err) {
      setOffline(Boolean(err.offline));
      setError(err.status === 401 ? 'That email and password do not match.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const tryDemo = () => {
    login(demoToken(), { firstName: 'Demo', lastName: 'User', email: 'demo@foodiehub.example', demo: true });
    showToast('Signed in to the demo. Orders stay in this browser.', 'info', 4000);
    navigate(next, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to order, track deliveries and see past orders."
      footer={<>New to FoodieHub? <Link to="/register" state={location.state} className="font-bold text-brand-600">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <label className="block">
          <span className="label">Email</span>
          <input id="login-email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <span className="relative block">
            <input id="login-password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" className="input pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="btn-primary btn-lg w-full" disabled={loading || !form.email || !form.password}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>

      {offline && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">
          <p className="font-semibold">The server is not running.</p>
          <p className="mt-1 text-ink-muted">You can still try the whole app with a demo account. Orders are kept in this browser only.</p>
          <button className="btn-secondary mt-3 w-full" onClick={tryDemo}>Continue with the demo account</button>
        </div>
      )}
    </AuthLayout>
  );
}
