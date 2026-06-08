import React from 'react';
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
