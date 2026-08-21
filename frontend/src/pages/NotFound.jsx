import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center px-6" style={{ padding: '6rem 2rem' }}>
      <UtensilsCrossed size={64} color="#fc8019" style={{ opacity: 0.5 }} />
      <h1 className="text-3xl font-bold mt-6" style={{ color: '#282c3f' }}>Page not found</h1>
      <p className="mt-2" style={{ color: '#7e808c' }}>The page you're looking for doesn't exist or has moved.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 font-bold text-white"
        style={{ padding: '12px 24px', backgroundColor: '#fc8019', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Back to home
      </button>
    </div>
  );
};

export default NotFound;
