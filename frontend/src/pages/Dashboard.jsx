import React, { useState, useEffect } from 'react';
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
