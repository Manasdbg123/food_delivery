import os

project = "frontend/src"

# 1. Update Navbar: Remove "Other", add real location state
navbar = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Percent, HelpCircle, User, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [location, setLocation] = useState('Koramangala, Bangalore');
  const [showLoc, setShowLoc] = useState(false);

  return (
    <header style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" alt="Logo" style={{ height: '30px' }} />
          </div>
          {/* Functional Location Selector */}
          <div onClick={() => setShowLoc(!showLoc)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', position: 'relative' }}>
            <span style={{ fontWeight: 'bold', color: '#3d4152', borderBottom: '2px solid #3d4152' }}>Home</span>
            <span style={{ color: '#686b78', marginLeft: '5px' }}>{location}</span> <ChevronDown size={16} color="#fc8019" />
            {showLoc && (
              <div style={{ position: 'absolute', top: '50px', left: 0, background: 'white', padding: '20px', border: '1px solid #e9e9eb', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', width: '300px' }}>
                <input 
                  type="text" 
                  placeholder="Enter your delivery area..." 
                  style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', outline: 'none' }} 
                  onKeyDown={(e) => { if(e.key === 'Enter') { setLocation(e.target.value); setShowLoc(false); } }}
                />
                <p style={{ fontSize: '12px', color: '#fc8019', marginTop: '10px', margin: '10px 0 0 0' }}>Press Enter to save</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '35px', fontSize: '16px', fontWeight: '500', color: '#3d4152' }}>
          <div onClick={() => navigate('/search')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={18} /> Search</div>
          <div onClick={() => navigate('/offers')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Percent size={18} /> Offers</div>
          <div onClick={() => navigate('/support')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} /> Help</div>
          <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Kaustuk</div>
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

# 2. Update Profile: Make Account Settings Functional
profile_page = """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Settings, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '280px', backgroundColor: '#fff', border: '1px solid #e9e9eb', minHeight: '600px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e9e9eb' }}>
          <h2 style={{ margin: '0', color: '#282c3f', fontSize: '24px' }}>Kaustuk</h2>
          <p style={{ margin: '5px 0 0 0', color: '#686b78', fontSize: '14px' }}>kaustuk@gmail.com</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Orders" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Settings" />
          <TabButton active={false} onClick={() => navigate('/login')} icon={<LogOut size={20} />} label="Logout" color="#e43b4f" />
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', border: '1px solid #e9e9eb' }}>
        {activeTab === 'orders' && <h2 style={{ marginTop: 0, color: '#282c3f' }}>Past Orders (Empty)</h2>}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f', marginBottom: '20px' }}>Edit Account Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Profile Updated Successfully!'); }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Full Name</label>
                <input type="text" defaultValue="Kaustuk" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Email Address</label>
                <input type="email" defaultValue="kaustuk@gmail.com" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Phone Number</label>
                <input type="tel" defaultValue="+91 9876543210" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>UPDATE PROFILE</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, color = '#3d4152' }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', backgroundColor: active ? '#f1f1f6' : 'transparent', border: 'none', borderRight: active ? '4px solid #fc8019' : '4px solid transparent', cursor: 'pointer', textAlign: 'left', color: color, fontSize: '16px', fontWeight: active ? 'bold' : '500' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>{icon} {label}</div>
    <ChevronRight size={18} style={{ opacity: active ? 1 : 0.4 }} />
  </button>
);
export default Profile;
"""

# 3. Update Menu: Add "Contact Restaurant" button
menu_page = """import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PhoneCall } from 'lucide-react';

const RestaurantMenu = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const mockMenus = {
    1: [{ id: 101, name: "Chicken Boneless Biryani", price: 340, v: false }, { id: 102, name: "Special Egg Biryani", price: 270, v: false }, { id: 103, name: "Paneer Tikka Biryani", price: 290, v: true }],
    8: [{ id: 801, name: "Ghee Podi Roast Dosa", price: 140, v: true }, { id: 802, name: "Traditional Thatte Idli", price: 70, v: true }]
  };
  const items = mockMenus[state?.id] || [{ id: 991, name: "Signature House Special", price: 299, v: true }];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {state && (
        <div style={{ borderBottom: '1px dashed #d4d5d9', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#282c3f' }}>{state.name}</h1>
            <p style={{ color: '#686b78', margin: '0 0 5px 0' }}>{state.cuisine}</p>
            <p style={{ color: '#686b78', margin: '0', fontWeight: 'bold' }}>{state.time} | ★ {state.rating}</p>
          </div>
          {/* Functional Contact Restaurant Button */}
          <button onClick={() => alert(`Dialing ${state.name} at +91 80-2345-6789...`)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #fc8019', color: '#fc8019', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <PhoneCall size={18} /> Contact Restaurant
          </button>
        </div>
      )}
      <h3 style={{ color: '#3d4152' }}>Recommended</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '0.5px solid #d4d5d9' }}>
            <div>
              <span style={{ fontSize: '10px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', padding: '2px 4px', color: item.v ? '#0f8a65' : '#e43b4f', borderRadius: '4px', fontWeight: 'bold' }}>{item.v ? '● VEG' : '▲ NON-VEG'}</span>
              <strong style={{ fontSize: '18px', display: 'block', marginTop: '8px', color: '#3d4152' }}>{item.name}</strong>
              <span style={{ color: '#3e4152', fontWeight: '500' }}>₹{item.price}</span>
            </div>
            <button style={{ padding: '8px 32px', backgroundColor: '#fff', color: '#60b246', border: '1px solid #d4d5d9', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onClick={() => addToCart(item)}>ADD</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RestaurantMenu;
"""

# 4. Update Help: Add "Customer Service Live Chat"
help_page = """import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const Help = () => {
  const [activeTopic, setActiveTopic] = useState('general');

  return (
    <div style={{ backgroundColor: '#37718e', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>Help & Support</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Let's take a step ahead and help you better.</p>
        </div>
        {/* Functional Contact Customer Service Button */}
        <button onClick={() => alert('Connecting you to a Live Customer Service Agent...')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <MessageSquare size={20} /> Chat with Customer Service
        </button>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', display: 'flex', minHeight: '500px' }}>
        <div style={{ width: '280px', backgroundColor: '#f1f1f6', padding: '30px 0' }}>
          <div onClick={() => setActiveTopic('general')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'general' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'general' ? 'bold' : 'normal', color: '#3d4152' }}>Partner Onboarding</div>
          <div onClick={() => setActiveTopic('legal')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'legal' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'legal' ? 'bold' : 'normal', color: '#3d4152' }}>Legal, Terms & Conditions</div>
        </div>
        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ margin: '0 0 30px 0', color: '#282c3f' }}>{activeTopic === 'general' ? 'Partner Onboarding Queries' : 'Legal Policies'}</h2>
          <p style={{ color: '#686b78', lineHeight: '1.6' }}>If you cannot find the answer to your question in our FAQ, please click the orange "Chat with Customer Service" button at the top of the page to speak with a representative immediately.</p>
        </div>
      </div>
    </div>
  );
};
export default Help;
"""

# 5. Create Dark Swiggy Footer Component
footer = """import React from 'react';

const Footer = () => (
  <footer style={{ backgroundColor: '#02060c', color: '#fff', padding: '60px 0', marginTop: 'auto', fontFamily: 'sans-serif' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', padding: '0 20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" alt="Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px' }}>FoodExpress</span>
        </div>
        <p style={{ color: '#808080', fontSize: '14px' }}>© 2026 Bundl Technologies Pvt. Ltd</p>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Company</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>About Us</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Careers</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Team</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Swiggy One</li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Contact us</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Help & Support</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Partner with us</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Ride with us</li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Legal</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Terms & Conditions</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Cookie Policy</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Privacy Policy</li>
        </ul>
      </div>
    </div>
  </footer>
);
export default Footer;
"""

with open(f"{project}/components/Navbar.jsx", "w", encoding="utf-8") as f: f.write(navbar)
with open(f"{project}/pages/Profile.jsx", "w", encoding="utf-8") as f: f.write(profile_page)
with open(f"{project}/pages/RestaurantMenu.jsx", "w", encoding="utf-8") as f: f.write(menu_page)
with open(f"{project}/pages/Help.jsx", "w", encoding="utf-8") as f: f.write(help_page)
with open(f"{project}/components/Footer.jsx", "w", encoding="utf-8") as f: f.write(footer)

print("[✓] All UI components fully synced and functional.")
