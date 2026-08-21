import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PhoneCall } from 'lucide-react';

const MOCK_MENUS = {
  1: [{ id: 101, name: "Chicken Boneless Biryani", price: 340, v: false }, { id: 102, name: "Special Egg Biryani", price: 270, v: false }, { id: 103, name: "Paneer Tikka Biryani", price: 290, v: true }],
  8: [{ id: 801, name: "Ghee Podi Roast Dosa", price: 140, v: true }, { id: 802, name: "Traditional Thatte Idli", price: 70, v: true }]
};

const RestaurantMenu = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, replaceCart } = useCart();
  const { showToast } = useToast();
  const [pendingItem, setPendingItem] = useState(null);
  const [items, setItems] = useState(MOCK_MENUS[id] || [{ id: 991, name: "Signature House Special", price: 299, v: true }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/v1/menus/restaurant/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map((m) => ({ id: m.id, name: m.name, price: m.price, v: m.isVeg })));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleAdd = (item) => {
    const result = addToCart(item, state?.id, state?.name);
    if (result === 'conflict') {
      setPendingItem(item);
    } else {
      showToast(`${item.name} added to cart`, 'success');
    }
  };

  const confirmReplace = () => {
    replaceCart(pendingItem, state?.id, state?.name);
    showToast(`Cart cleared — ${pendingItem.name} added`, 'info');
    setPendingItem(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {state && (
        <div style={{ borderBottom: '1px dashed #d4d5d9', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#282c3f' }}>{state.name}</h1>
            <p style={{ color: '#686b78', margin: '0 0 5px 0' }}>{state.cuisine}</p>
            <p style={{ color: '#686b78', margin: '0', fontWeight: 'bold' }}>{state.avgDeliveryTimeMinutes ?? state.time} min | ★ {state.rating}</p>
          </div>
          {/* Functional Contact Restaurant Button */}
          <button onClick={() => showToast(`Dialing ${state.name}...`, 'info')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #fc8019', color: '#fc8019', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <PhoneCall size={18} /> Contact Restaurant
          </button>
        </div>
      )}

      {pendingItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', maxWidth: '360px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#282c3f' }}>Start a new cart?</h3>
            <p style={{ color: '#7e808c', fontSize: '14px', margin: '0 0 20px 0' }}>Your cart has items from another restaurant. Adding this item will clear it and start a new order from {state?.name}.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setPendingItem(null)} style={{ flex: 1, padding: '10px', border: '1px solid #d4d5d9', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={confirmReplace} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: '#fc8019', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Yes, start new</button>
            </div>
          </div>
        </div>
      )}
      <h3 style={{ color: '#3d4152' }}>Recommended</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading && items.length === 0 && <p style={{ color: '#7e808c' }}>Loading menu...</p>}
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '0.5px solid #d4d5d9' }}>
            <div>
              <span style={{ fontSize: '10px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', padding: '2px 4px', color: item.v ? '#0f8a65' : '#e43b4f', borderRadius: '4px', fontWeight: 'bold' }}>{item.v ? '● VEG' : '▲ NON-VEG'}</span>
              <strong style={{ fontSize: '18px', display: 'block', marginTop: '8px', color: '#3d4152' }}>{item.name}</strong>
              <span style={{ color: '#3e4152', fontWeight: '500' }}>₹{item.price}</span>
            </div>
            <button style={{ padding: '8px 32px', backgroundColor: '#fff', color: '#60b246', border: '1px solid #d4d5d9', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onClick={() => handleAdd(item)}>ADD</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RestaurantMenu;
