import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Percent, HelpCircle, User, ShoppingCart, ChevronDown, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocationState } from '../context/LocationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { city, setCity } = useLocationState();
  const [showLoc, setShowLoc] = useState(false);
  
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'];

  return (
    <header style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" alt="Logo" style={{ height: '30px' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <div onClick={() => setShowLoc(!showLoc)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: '#3d4152', borderBottom: '2px solid #3d4152' }}>Home</span>
              <span style={{ color: '#686b78', marginLeft: '5px' }}>{city}</span> <ChevronDown size={16} color="#fc8019" />
            </div>
            {showLoc && (
              <div style={{ position: 'absolute', top: '40px', left: 0, background: 'white', padding: '10px', border: '1px solid #e9e9eb', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', width: '200px' }}>
                <h4 style={{ margin: '0 0 10px 5px', color: '#7e808c', fontSize: '12px' }}>SELECT CITY</h4>
                {cities.map(c => (
                  <div key={c} onClick={() => { setCity(c); setShowLoc(false); navigate('/dashboard'); }} style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px', color: city === c ? '#fc8019' : '#3d4152', fontWeight: city === c ? 'bold' : 'normal' }}>
                    <MapPin size={14} style={{ marginRight: '8px', display: 'inline' }} /> {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '35px', fontSize: '16px', fontWeight: '500', color: '#3d4152' }}>
          <div onClick={() => navigate('/search')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={18} /> Search</div>
          <div onClick={() => navigate('/offers')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Percent size={18} /> Offers</div>
          <div onClick={() => navigate('/support')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} /> Help</div>
          <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Account</div>
          <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} /> Cart {cart.length > 0 && <span style={{ backgroundColor: '#60b246', color: 'white', padding: '2px 6px', borderRadius: '50%', fontSize: '12px' }}>{cart.length}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
