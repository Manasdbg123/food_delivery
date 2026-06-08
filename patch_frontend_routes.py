import os

project = "frontend/src"

# 1. Global State Management (Cart Context)
cart_context = """import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
"""

# 2. Updated Navbar (Now reads from Cart Context)
navbar = """import React from 'react';
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
"""

# 3. Updated Menu (Now writes to Cart Context)
menu_page = """import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const mockMenus = {
    1: [{ id: 101, name: "Chicken Boneless Biryani", price: 340, v: false }, { id: 102, name: "Special Egg Biryani", price: 270, v: false }, { id: 103, name: "Paneer Tikka Biryani", price: 290, v: true }],
    2: [{ id: 201, name: "All American Cheese Burger", price: 240, v: false }, { id: 202, name: "Crispy Peri Peri Wings", price: 190, v: false }, { id: 203, name: "Classic Fudge Brownie", price: 150, v: true }],
    8: [{ id: 801, name: "Ghee Podi Roast Dosa", price: 140, v: true }, { id: 802, name: "Traditional Thatte Idli", price: 70, v: true }, { id: 803, name: "Filter Filter Coffee", price: 45, v: true }]
  };

  const items = mockMenus[state?.id] || [
    { id: 991, name: "Signature House Special", price: 299, v: true },
    { id: 992, name: "Chef's Fusion Platter", price: 399, v: false }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff' }}>← Back to Outlets</button>
      {state && (
        <div style={{ borderBottom: '2px dashed #e0e0e0', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#282c3f' }}>{state.name}</h1>
          <p style={{ color: '#686b78', margin: '0' }}>{state.cuisine} • {state.time}</p>
        </div>
      )}
      <h3 style={{ color: '#3d4152' }}>Menu Selection</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e9e9eb', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '10px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', padding: '2px 4px', color: item.v ? '#0f8a65' : '#e43b4f', borderRadius: '4px', marginRight: '8px', fontWeight: 'bold' }}>{item.v ? '● VEG' : '▲ NON-VEG'}</span>
              <strong style={{ fontSize: '18px', display: 'block', marginTop: '8px', color: '#3d4152' }}>{item.name}</strong>
              <span style={{ color: '#3e4152', fontWeight: '500' }}>₹{item.price}</span>
            </div>
            <button 
              style={{ padding: '8px 32px', backgroundColor: '#fff', color: '#60b246', border: '1px solid #d4d5d9', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} 
              onClick={() => addToCart(item)}
            >ADD</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RestaurantMenu;
"""

# 4. New Inner Pages
search_page = """import React from 'react';
const Search = () => (
  <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
    <input type="text" placeholder="Search for restaurants and food..." style={{ width: '100%', padding: '16px 24px', fontSize: '18px', border: '1px solid #d4d5d9', borderRadius: '8px', outline: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }} />
    <h3 style={{ marginTop: '30px', color: '#7e808c', fontWeight: '500' }}>Recent Searches</h3>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
      <span style={{ padding: '8px 16px', border: '1px solid #e9e9eb', borderRadius: '20px', cursor: 'pointer' }}>Biryani</span>
      <span style={{ padding: '8px 16px', border: '1px solid #e9e9eb', borderRadius: '20px', cursor: 'pointer' }}>Pizza</span>
      <span style={{ padding: '8px 16px', border: '1px solid #e9e9eb', borderRadius: '20px', cursor: 'pointer' }}>Burger</span>
    </div>
  </div>
);
export default Search;
"""

offers_page = """import React from 'react';
const Offers = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#005062', color: 'white', padding: '40px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '40px', margin: '0 0 10px 0' }}>Offers for you</h1>
        <p style={{ fontSize: '18px', margin: '0', opacity: 0.8 }}>Explore top deals and offers exclusively for you!</p>
      </div>
      <div style={{ fontSize: '60px' }}>%</div>
    </div>
  </div>
);
export default Offers;
"""

profile_page = """import React from 'react';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // In production, clear tokens here
    navigate('/login');
  };
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#282c3f' }}>My Account</h1>
      <div style={{ padding: '20px', border: '1px solid #e9e9eb', borderRadius: '12px', marginTop: '20px' }}>
        <h2>Kaustuk</h2>
        <p style={{ color: '#686b78' }}>Software Engineer | SDE-1</p>
        <hr style={{ border: 'none', borderTop: '1px dashed #e9e9eb', margin: '20px 0' }} />
        <button style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #fc8019', color: '#fc8019', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }} onClick={handleLogout}>LOGOUT</button>
      </div>
    </div>
  );
};
export default Profile;
"""

cart_page = """import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" style={{ width: '270px', opacity: 0.8 }} />
        <h2 style={{ color: '#535665', marginTop: '20px' }}>Your cart is empty</h2>
        <p style={{ color: '#7e808c' }}>You can go to home page to view more restaurants</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SEE RESTAURANTS NEAR YOU</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #282c3f', paddingBottom: '10px', display: 'inline-block' }}>Secure Checkout</h2>
        <div style={{ marginTop: '20px' }}>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '8px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', color: item.v ? '#0f8a65' : '#e43b4f', padding: '1px 2px' }}>{item.v ? '●' : '▲'}</span>
                {item.name}
              </span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <div style={{ borderTop: '2px solid #e9e9eb', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
            <span>TO PAY</span>
            <span>₹{total}</span>
          </div>
          <button onClick={() => { alert('Order Placed Successfully!'); clearCart(); navigate('/dashboard'); }} style={{ width: '100%', padding: '14px', backgroundColor: '#60b246', color: 'white', border: 'none', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', fontSize: '16px' }}>PROCEED TO PAY</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
"""

# 5. Master App Rewiring
app_js = """import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RestaurantMenu from './pages/RestaurantMenu';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 80px)' }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
"""

# Execute File Creation
os.makedirs(f"{project}/context", exist_ok=True)
os.makedirs(f"{project}/pages", exist_ok=True)
os.makedirs(f"{project}/components", exist_ok=True)

with open(f"{project}/context/CartContext.jsx", "w", encoding="utf-8") as f: f.write(cart_context)
with open(f"{project}/components/Navbar.jsx", "w", encoding="utf-8") as f: f.write(navbar)
with open(f"{project}/pages/RestaurantMenu.jsx", "w", encoding="utf-8") as f: f.write(menu_page)
with open(f"{project}/pages/Search.jsx", "w", encoding="utf-8") as f: f.write(search_page)
with open(f"{project}/pages/Offers.jsx", "w", encoding="utf-8") as f: f.write(offers_page)
with open(f"{project}/pages/Profile.jsx", "w", encoding="utf-8") as f: f.write(profile_page)
with open(f"{project}/pages/Cart.jsx", "w", encoding="utf-8") as f: f.write(cart_page)
with open(f"{project}/App.jsx", "w", encoding="utf-8") as f: f.write(app_js)

print("[✓] Phase 2: Complete Global Routing and State Architecture injected.")
