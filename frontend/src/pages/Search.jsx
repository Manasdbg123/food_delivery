import React from 'react';
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
