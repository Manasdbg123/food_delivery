import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRestaurants([
      { id: 1, name: "Meghana Foods", cuisine: "Biryani, Andhra", rating: 4.5, time: "30-40 min", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500" },
      { id: 2, name: "Truffles", cuisine: "Burgers, American", rating: 4.4, time: "25-35 min", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
      { id: 3, name: "Empire Restaurant", cuisine: "North Indian, Mughlai", rating: 4.2, time: "35-45 min", img: "https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500" },
      { id: 4, name: "A2B - Adyar Ananda Bhavan", cuisine: "South Indian, Sweets", rating: 4.3, time: "20-30 min", img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500" },
      { id: 5, name: "Domino's Pizza", cuisine: "Pizzas, Fast Food", rating: 4.1, time: "25-30 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
      { id: 6, name: "KFC", cuisine: "Burger, Fast Food", rating: 4.0, time: "20-30 min", img: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500" },
      { id: 7, name: "Corner House Ice Cream", cuisine: "Desserts, Ice Cream", rating: 4.8, time: "15-25 min", img: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=500" },
      { id: 8, name: "Rameshwaram Cafe", cuisine: "South Indian", rating: 4.6, time: "40-50 min", img: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500" },
      { id: 9, name: "Nagarjuna", cuisine: "Andhra, Biryani", rating: 4.4, time: "30-40 min", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500" },
      { id: 10, name: "Leon's Burgers & Wings", cuisine: "American, Fast Food", rating: 4.3, time: "25-35 min", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500" },
      { id: 11, name: "Ambur Star Briyani", cuisine: "Biryani, South Indian", rating: 4.1, time: "35-45 min", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500" },
      { id: 12, name: "McDonald's", cuisine: "Burgers, Beverages", "rating": 4.2, "time": "20-30 min", "img": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"},
      { id: 13, name: "Polar Bear", cuisine: "Desserts, Ice Cream", "rating": 4.3, "time": "15-25 min", "img": "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=500"},
      { id: 14, name: "Behrouz Biryani", cuisine: "Biryani, Mughlai", "rating": 4.0, "time": "45-55 min", "img": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500"},
      { id: 15, name: "Theobroma", cuisine: "Bakery, Desserts", "rating": 4.5, "time": "25-35 min", "img": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"}
    ]);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#1c1c1c' }}>Trending Outlets Near Me</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' }}>
        {restaurants.map((res) => (
          <div 
            key={res.id} 
            onClick={() => navigate(`/restaurant/${res.id}`, { state: res })}
            style={{ cursor: 'pointer', transition: 'transform 0.2s', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
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
    </div>
  );
};
export default Dashboard;
