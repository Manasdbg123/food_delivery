import React, { useState } from 'react';
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
