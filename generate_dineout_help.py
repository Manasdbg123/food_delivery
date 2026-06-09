import os

project = "frontend/src"

dineout_page = """import React from 'react';

const Dineout = () => {
  const venues = [
    { id: 1, name: "The Bier Library", area: "Koramangala", discount: "Flat 15% off on walk-in", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500" },
    { id: 2, name: "Windmills Craftworks", area: "Whitefield", discount: "10% off on food bill", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500" },
    { id: 3, name: "Toit Brewpub", area: "Indiranagar", discount: "Complimentary Dessert", img: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=500" }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#2b1e16', color: 'white', padding: '40px', borderRadius: '16px', marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '36px' }}>Discover the best restaurants to dine out</h1>
        <p style={{ fontSize: '18px', opacity: 0.8 }}>Book tables and get exclusive discounts.</p>
      </div>
      
      <h2 style={{ color: '#282c3f', marginBottom: '20px' }}>Trending Dining Spots</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {venues.map((venue) => (
          <div key={venue.id} style={{ border: '1px solid #e9e9eb', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <img src={venue.img} alt={venue.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#3d4152' }}>{venue.name}</h3>
              <p style={{ margin: '0 0 15px 0', color: '#686b78' }}>{venue.area}</p>
              <div style={{ backgroundColor: '#f1f1f6', color: '#fc8019', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', display: 'inline-block', marginBottom: '15px' }}>{venue.discount}</div>
              <button style={{ width: '100%', padding: '12px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>BOOK A TABLE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dineout;
"""

help_page = """import React, { useState } from 'react';

const Help = () => {
  const [activeTopic, setActiveTopic] = useState('orders');

  return (
    <div style={{ backgroundColor: '#37718e', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>Help & Support</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Let's take a step ahead and help you better.</p>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', display: 'flex', overflow: 'hidden', minHeight: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        {/* Help Sidebar */}
        <div style={{ width: '280px', backgroundColor: '#f1f1f6', padding: '30px 0' }}>
          <div onClick={() => setActiveTopic('orders')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'orders' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'orders' ? 'bold' : 'normal', color: '#3d4152' }}>Help with orders</div>
          <div onClick={() => setActiveTopic('general')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'general' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'general' ? 'bold' : 'normal', color: '#3d4152' }}>General issues</div>
          <div onClick={() => setActiveTopic('legal')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'legal' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'legal' ? 'bold' : 'normal', color: '#3d4152' }}>Legal, Terms & Conditions</div>
        </div>
        
        {/* Help Content */}
        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ margin: '0 0 30px 0', color: '#282c3f' }}>{activeTopic === 'orders' ? 'Past Orders' : activeTopic === 'general' ? 'General Queries' : 'Legal Policies'}</h2>
          
          {activeTopic === 'orders' && (
            <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '12px', color: '#686b78' }}>
              <p>You have no active orders to display.</p>
              <button style={{ padding: '10px 20px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>VIEW PAST ORDERS</button>
            </div>
          )}
          
          {activeTopic === 'general' && (
            <div>
              <details style={{ borderBottom: '1px solid #e9e9eb', paddingBottom: '15px', marginBottom: '15px' }}>
                <summary style={{ fontWeight: 'bold', color: '#3d4152', cursor: 'pointer', outline: 'none' }}>What is Swiggy Customer Care Number?</summary>
                <p style={{ color: '#686b78', marginTop: '10px', lineHeight: '1.5' }}>We value our customer's time and hence moved away from a single customer care number to a comprehensive chat-based support system for quicker resolution.</p>
              </details>
              <details style={{ borderBottom: '1px solid #e9e9eb', paddingBottom: '15px', marginBottom: '15px' }}>
                <summary style={{ fontWeight: 'bold', color: '#3d4152', cursor: 'pointer', outline: 'none' }}>Can I edit my order?</summary>
                <p style={{ color: '#686b78', marginTop: '10px', lineHeight: '1.5' }}>Your order can be edited before it reaches the restaurant. You could contact customer support team via chat to do so.</p>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Help;
"""

os.makedirs(f"{project}/pages", exist_ok=True)
with open(f"{project}/pages/Dineout.jsx", "w", encoding="utf-8") as f: f.write(dineout_page)
with open(f"{project}/pages/Help.jsx", "w", encoding="utf-8") as f: f.write(help_page)

print("[✓] Dineout and Help pages successfully created.")
