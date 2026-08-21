import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast('Account created! You can now sign in.', 'success');
        navigate('/login');
      } else {
        setStatus('Registration failed. Email might already be in use.');
      }
    } catch (err) {
      setStatus('Backend is offline. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-center mb-6"><Logo /></div>
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      {status && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-bold">{status}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">First Name</label>
            <input type="text" required onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-bold mb-2">Last Name</label>
            <input type="text" required onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Password</label>
          <input type="password" required minLength={8} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-60">
          {loading ? 'Creating account...' : 'Complete Registration'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account? <Link to="/login" className="text-orange-600 font-bold">Sign in</Link>
      </p>
    </div>
  );
}
