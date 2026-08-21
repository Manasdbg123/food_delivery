import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Percent, HelpCircle, User, ShoppingCart, ChevronDown, MapPin, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocationState } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { city, setCity } = useLocationState();
  const { isAuthenticated, logout } = useAuth();
  const [showLoc, setShowLoc] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Search', icon: <Search size={18} />, to: '/search' },
    { label: 'Offers', icon: <Percent size={18} />, to: '/offers' },
    { label: 'Help', icon: <HelpCircle size={18} />, to: '/support' },
    { label: 'Account', icon: <User size={18} />, to: '/profile' },
  ];

  return (
    <header style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <Logo />
          </div>
          <div style={{ position: 'relative' }} className="hidden md:block">
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

        <div className="hidden md:flex" style={{ gap: '35px', fontSize: '16px', fontWeight: '500', color: '#3d4152' }}>
          {navLinks.map((link) => (
            <div key={link.to} onClick={() => navigate(link.to)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {link.icon} {link.label}
            </div>
          ))}
          <div onClick={() => navigate('/cart')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} /> Cart {itemCount > 0 && <span style={{ backgroundColor: '#60b246', color: 'white', padding: '2px 6px', borderRadius: '50%', fontSize: '12px' }}>{itemCount}</span>}
          </div>
          {isAuthenticated && (
            <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#e43b4f' }}>
              <LogOut size={18} /> Logout
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid #e9e9eb', padding: '10px 20px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((link) => (
            <div key={link.to} onClick={() => { navigate(link.to); setMobileOpen(false); }} style={{ padding: '12px 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#3d4152', fontWeight: 500 }}>
              {link.icon} {link.label}
            </div>
          ))}
          <div onClick={() => { navigate('/cart'); setMobileOpen(false); }} style={{ padding: '12px 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#3d4152', fontWeight: 500 }}>
            <ShoppingCart size={18} /> Cart {itemCount > 0 && `(${itemCount})`}
          </div>
          {isAuthenticated && (
            <div onClick={handleLogout} style={{ padding: '12px 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#e43b4f', fontWeight: 500 }}>
              <LogOut size={18} /> Logout
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
