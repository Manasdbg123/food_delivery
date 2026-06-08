import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" style={{ width: '270px', opacity: 0.8 }} />
        <h2 style={{ color: '#535665', marginTop: '20px' }}>Your cart is empty</h2>
        <p style={{ color: '#7e808c' }}>You can go to home page to view more restaurants</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SEE RESTAURANTS NEAR YOU</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ borderBottom: '2px solid #282c3f', paddingBottom: '10px', display: 'inline-block' }}>Secure Checkout</h2>
        <div style={{ marginTop: '20px' }}>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '8px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', color: item.v ? '#0f8a65' : '#e43b4f', padding: '1px 2px' }}>{item.v ? '●' : '▲'}</span>
                {item.name}
              </span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <div style={{ borderTop: '2px solid #e9e9eb', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
            <span>TO PAY</span>
            <span>₹{total}</span>
          </div>
          <button onClick={() => { alert('Order Placed Successfully!'); clearCart(); navigate('/dashboard'); }} style={{ width: '100%', padding: '14px', backgroundColor: '#60b246', color: 'white', border: 'none', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', fontSize: '16px' }}>PROCEED TO PAY</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
