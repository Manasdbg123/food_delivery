import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import AuthLayout from './AuthLayout';

const strength = (pw) => [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const score = strength(form.password);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    setLoading(true);
    try {
      await api('/auth/register', { method: 'POST', body: form, auth: false });
      // Sign straight in rather than making the user type the same details again.
      const data = await api('/auth/login', { method: 'POST', body: { email: form.email, password: form.password }, auth: false });
      login(data.token, { ...(data.user || {}), firstName: form.firstName, lastName: form.lastName, email: form.email });
      showToast(`Welcome to FoodieHub, ${form.firstName}!`, 'success');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.status === 409 ? 'An account with this email already exists. Try signing in.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-bold text-brand-600">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <label><span className="label">First name</span><input id="reg-first" required autoComplete="given-name" className="input" value={form.firstName} onChange={set('firstName')} /></label>
          <label><span className="label">Last name</span><input id="reg-last" required autoComplete="family-name" className="input" value={form.lastName} onChange={set('lastName')} /></label>
        </div>
        <label className="block"><span className="label">Email</span><input id="reg-email" type="email" required autoComplete="email" className="input" value={form.email} onChange={set('email')} /></label>
        <label className="block">
          <span className="label">Password</span>
          <input id="reg-password" type="password" required minLength={8} autoComplete="new-password" className="input" value={form.password} onChange={set('password')} />
          {form.password && (
            <span className="mt-2 flex items-center gap-2">
              <span className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? (score >= 3 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-stone-200'}`} />)}
              </span>
              <span className="text-xs font-semibold text-ink-muted">{STRENGTH[score]}</span>
            </span>
          )}
        </label>
        <button className="btn-primary btn-lg w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        <p className="text-center text-xs text-ink-muted">By continuing you agree to the terms of service and privacy policy.</p>
      </form>
    </AuthLayout>
  );
}
