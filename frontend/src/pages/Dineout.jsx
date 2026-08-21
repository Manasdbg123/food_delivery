import React from 'react';

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
