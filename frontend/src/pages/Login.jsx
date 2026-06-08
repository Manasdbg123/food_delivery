import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
        window.location.reload(); // Refresh navbar state
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) { setError('Backend is offline.'); }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
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
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700">Secure Login</button>
      </form>
    </div>
  );
}
