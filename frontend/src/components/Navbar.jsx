import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Percent, HelpCircle, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const navItemStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'color 0.2s' };

  return (
    <header style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: '#fc8019', borderRadius: '12px', padding: '8px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" alt="Logo" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>
          <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', borderBottom: '2px solid #3d4152', color: '#3d4152' }}>Other</span>
            <span style={{ color: '#686b78' }}>Bangalore, Karnataka, India</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', fontSize: '16px', fontWeight: '500', color: '#3d4152' }}>
          <div style={navItemStyle} onClick={() => navigate('/search')}><Search size={18} /> Search</div>
          <div style={navItemStyle} onClick={() => navigate('/offers')}><Percent size={18} /> Offers <sup style={{ color: '#ffa700', fontSize: '10px' }}>NEW</sup></div>
          <div style={navItemStyle} onClick={() => alert('Help Center Integration Pending')}><HelpCircle size={18} /> Help</div>
          <div style={navItemStyle} onClick={() => navigate('/profile')}><User size={18} /> Kaustuk</div>
          <div style={navItemStyle} onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} /> Cart 
            {cart.length > 0 && <span style={{ backgroundColor: '#60b246', color: 'white', padding: '2px 6px', borderRadius: '50%', fontSize: '12px' }}>{cart.length}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
