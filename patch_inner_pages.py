import os

project = "frontend/src"

# 1. New Location Context
location_context = """import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();
export const useLocationState = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState('Bangalore');
  return (
    <LocationContext.Provider value={{ city, setCity }}>
      {children}
    </LocationContext.Provider>
  );
};
"""

# 2. Upgraded Navbar (Reads/Writes City)
navbar = """import React, { useState } from 'react';
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
"""

# 3. Upgraded Dashboard (Filters by City)
dashboard_page = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationState } from '../context/LocationContext';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const { city } = useLocationState();

  useEffect(() => {
    const allRestaurants = [
      { id: 1, city: "Bangalore", name: "Meghana Foods", cuisine: "Biryani, Andhra", rating: 4.5, time: "30 min", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500" },
      { id: 2, city: "Bangalore", name: "Truffles", cuisine: "Burgers, American", rating: 4.4, time: "35 min", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
      { id: 3, city: "Bangalore", name: "Rameshwaram Cafe", cuisine: "South Indian", rating: 4.6, time: "40 min", img: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500" },
      { id: 4, city: "Mumbai", name: "Leopold Cafe", cuisine: "Continental, Desserts", rating: 4.3, time: "25 min", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" },
      { id: 5, city: "Mumbai", name: "Bademiya", cuisine: "Kebabs, Mughlai", rating: 4.2, time: "45 min", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500" },
      { id: 6, city: "Mumbai", name: "Britannia & Co.", cuisine: "Parsi, Biryani", rating: 4.5, time: "30 min", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500" },
      { id: 7, city: "Delhi", name: "Karim's", cuisine: "Mughlai, North Indian", rating: 4.7, time: "40 min", img: "https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500" },
      { id: 8, city: "Delhi", name: "Bukhara", cuisine: "North Indian", rating: 4.8, time: "50 min", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500" },
      { id: 9, city: "Delhi", name: "Big Chill", cuisine: "Italian, Desserts", rating: 4.6, time: "35 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
      { id: 10, city: "Hyderabad", name: "Paradise Biryani", cuisine: "Biryani, Hyderabadi", rating: 4.1, time: "30 min", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500" },
      { id: 11, city: "Hyderabad", name: "Bawarchi", cuisine: "Biryani, North Indian", rating: 4.3, time: "35 min", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500" },
      { id: 12, city: "Hyderabad", name: "Cafe Bahar", cuisine: "Biryani, Desserts", rating: 4.4, time: "25 min", img: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500" },
      { id: 13, city: "Chennai", name: "Murugan Idli Shop", cuisine: "South Indian", rating: 4.5, time: "20 min", img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500" },
      { id: 14, city: "Chennai", name: "Anjappar", cuisine: "Chettinad, Biryani", rating: 4.2, time: "40 min", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500" },
      { id: 15, city: "Chennai", name: "Saravana Bhavan", cuisine: "South Indian, Pure Veg", rating: 4.4, time: "25 min", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500" }
    ];
    setRestaurants(allRestaurants.filter(r => r.city === city));
  }, [city]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#1c1c1c' }}>Restaurants with online food delivery in {city}</h2>
      
      {restaurants.length === 0 ? (
        <p style={{ color: '#686b78' }}>No restaurants found in this city yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' }}>
          {restaurants.map((res) => (
            <div key={res.id} onClick={() => navigate(`/restaurant/${res.id}`, { state: res })} style={{ cursor: 'pointer', transition: 'transform 0.2s', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={res.img} alt={res.name} style={{ width: '100%', height: '182px', objectFit: 'cover' }} />
              <div style={{ padding: '14px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#2b2b2b' }}>{res.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#505050' }}>
                  <span style={{ backgroundColor: '#25a044', color: 'white', padding: '3px 6px', borderRadius: '6px', fontSize: '12px' }}>★ {res.rating}</span>
                  <span>• {res.time}</span>
                </div>
                <p style={{ margin: '8px 0 0 0', color: '#707070', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.cuisine}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
"""

# 4. Upgraded Search Page (Live Filtering Mockup)
search_page = """import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const tags = ["Biryani", "Pizza", "Burger", "Dosa", "Cake", "Rolls"];

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for restaurants and food..." 
          style={{ width: '100%', padding: '16px 48px 16px 24px', fontSize: '18px', border: '1px solid #d4d5d9', borderRadius: '8px', outline: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', boxSizing: 'border-box' }} 
        />
        <SearchIcon size={20} color="#686b78" style={{ position: 'absolute', right: '20px', top: '18px' }} />
      </div>
      
      {!query && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#3d4152', fontSize: '20px', marginBottom: '20px' }}>Popular Cuisines</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {tags.map(tag => (
              <span key={tag} onClick={() => setQuery(tag)} style={{ padding: '10px 20px', border: '1px solid #e9e9eb', borderRadius: '24px', cursor: 'pointer', color: '#3d4152', fontWeight: '500', transition: 'all 0.2s' }} onMouseOver={(e) => {e.target.style.borderColor = '#fc8019'; e.target.style.color = '#fc8019'}} onMouseOut={(e) => {e.target.style.borderColor = '#e9e9eb'; e.target.style.color = '#3d4152'}}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#686b78', padding: '40px', backgroundColor: '#f1f1f6', borderRadius: '12px' }}>
          <SearchIcon size={40} color="#d4d5d9" style={{ marginBottom: '15px' }} />
          <h3>Searching for "{query}"...</h3>
          <p>Connecting to Inventory Microservice...</p>
        </div>
      )}
    </div>
  );
};
export default Search;
"""

# 5. Upgraded App.jsx (Inject LocationProvider)
app_js = """import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RestaurantMenu from './pages/RestaurantMenu';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dineout from './pages/Dineout';
import Help from './pages/Help';
import Footer from './components/Footer';

function App() {
  return (
    <LocationProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ backgroundColor: '#fff', flex: 1 }}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dineout" element={<Dineout />} />
                    <Route path="/support" element={<Help />} />
                    <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </LocationProvider>
  );
}
export default App;
"""

# 6. Generate the new Database Seed Script (Multi-City)
sql_script = """CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (
    id INT PRIMARY KEY, name VARCHAR(255), city VARCHAR(100), cuisine VARCHAR(255), 
    rating FLOAT, delivery_time VARCHAR(50), image_url VARCHAR(500)
);

-- Bangalore
INSERT IGNORE INTO restaurants VALUES (1, 'Meghana Foods', 'Bangalore', 'Biryani, Andhra', 4.5, '30 min', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500');
INSERT IGNORE INTO restaurants VALUES (2, 'Truffles', 'Bangalore', 'Burgers, American', 4.4, '35 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500');
INSERT IGNORE INTO restaurants VALUES (3, 'Rameshwaram Cafe', 'Bangalore', 'South Indian', 4.6, '40 min', 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500');

-- Mumbai
INSERT IGNORE INTO restaurants VALUES (4, 'Leopold Cafe', 'Mumbai', 'Continental, Desserts', 4.3, '25 min', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500');
INSERT IGNORE INTO restaurants VALUES (5, 'Bademiya', 'Mumbai', 'Kebabs, Mughlai', 4.2, '45 min', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500');
INSERT IGNORE INTO restaurants VALUES (6, 'Britannia & Co.', 'Mumbai', 'Parsi, Biryani', 4.5, '30 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');

-- Delhi
INSERT IGNORE INTO restaurants VALUES (7, 'Karims', 'Delhi', 'Mughlai, North Indian', 4.7, '40 min', 'https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500');
INSERT IGNORE INTO restaurants VALUES (8, 'Bukhara', 'Delhi', 'North Indian', 4.8, '50 min', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500');
INSERT IGNORE INTO restaurants VALUES (9, 'Big Chill', 'Delhi', 'Italian, Desserts', 4.6, '35 min', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500');

-- Hyderabad
INSERT IGNORE INTO restaurants VALUES (10, 'Paradise Biryani', 'Hyderabad', 'Biryani, Hyderabadi', 4.1, '30 min', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500');
INSERT IGNORE INTO restaurants VALUES (11, 'Bawarchi', 'Hyderabad', 'Biryani, North Indian', 4.3, '35 min', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500');
INSERT IGNORE INTO restaurants VALUES (12, 'Cafe Bahar', 'Hyderabad', 'Biryani, Desserts', 4.4, '25 min', 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500');

-- Chennai
INSERT IGNORE INTO restaurants VALUES (13, 'Murugan Idli Shop', 'Chennai', 'South Indian', 4.5, '20 min', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500');
INSERT IGNORE INTO restaurants VALUES (14, 'Anjappar', 'Chennai', 'Chettinad, Biryani', 4.2, '40 min', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500');
INSERT IGNORE INTO restaurants VALUES (15, 'Saravana Bhavan', 'Chennai', 'South Indian, Pure Veg', 4.4, '25 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');
"""

# Execute writes
os.makedirs(f"{project}/context", exist_ok=True)
with open(f"{project}/context/LocationContext.jsx", "w", encoding="utf-8") as f: f.write(location_context)
with open(f"{project}/components/Navbar.jsx", "w", encoding="utf-8") as f: f.write(navbar)
with open(f"{project}/pages/Dashboard.jsx", "w", encoding="utf-8") as f: f.write(dashboard_page)
with open(f"{project}/pages/Search.jsx", "w", encoding="utf-8") as f: f.write(search_page)
with open(f"{project}/App.jsx", "w", encoding="utf-8") as f: f.write(app_js)
with open("infrastructure/docker/zomato_multicity_seed.sql", "w", encoding="utf-8") as f: f.write(sql_script)

print("[✓] Multi-city architecture, location context, and polished inner pages injected successfully.")
