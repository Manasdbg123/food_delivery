import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Registering user and publishing to Kafka...');
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Account created! User data safely processed via Event-Driven Architecture.');
        navigate('/login');
      } else {
        setStatus('Registration failed. Email might exist.');
      }
    } catch (err) { setStatus('Backend is offline.'); }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      {status && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm font-bold">{status}</div>}
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
          <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700">Complete Registration</button>
      </form>
    </div>
  );
}
