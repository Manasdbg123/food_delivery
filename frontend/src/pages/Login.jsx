import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        login(data.token, data.user ?? { email });
        showToast('Welcome back!', 'success');
        navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Backend is offline. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-center mb-6"><Logo /></div>
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Secure Login'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        New here? <Link to="/register" className="text-orange-600 font-bold">Create an account</Link>
      </p>
    </div>
  );
}
