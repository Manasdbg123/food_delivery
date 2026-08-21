import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';

const DELIVERY_FEE = 40;
const PLATFORM_FEE = 6;
const GST_RATE = 0.05;

const Cart = () => {
  const { cart, restaurantName, updateQty, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [placing, setPlacing] = useState(false);

  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE + PLATFORM_FEE : 0) + gst;

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <ShoppingBag size={72} color="#d4d5d9" style={{ margin: '0 auto' }} />
        <h2 style={{ color: '#535665', marginTop: '20px' }}>Your cart is empty</h2>
        <p style={{ color: '#7e808c' }}>You can go to home page to view more restaurants</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SEE RESTAURANTS NEAR YOU</button>
      </div>
    );
  }

  const handleCheckout = () => {
    setPlacing(true);
    setTimeout(() => {
      showToast('Order placed successfully!', 'success');
      navigate('/order-tracking', { state: { restaurantName, total } });
      clearCart();
      setPlacing(false);
    }, 600);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
        <h2 style={{ borderBottom: '2px solid #282c3f', paddingBottom: '10px', display: 'inline-block' }}>Secure Checkout</h2>
        {restaurantName && <p style={{ color: '#7e808c', fontSize: '14px', marginTop: '10px' }}>From {restaurantName}</p>}
        <div style={{ marginTop: '20px' }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', fontSize: '14px', borderBottom: '1px solid #f1f1f6' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '8px', border: '1px solid', borderColor: item.v ? '#0f8a65' : '#e43b4f', color: item.v ? '#0f8a65' : '#e43b4f', padding: '1px 2px' }}>{item.v ? '●' : '▲'}</span>
                {item.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #d4d5d9', borderRadius: '6px', padding: '4px 8px' }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fc8019' }}><Minus size={14} /></button>
                  <span style={{ minWidth: '16px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fc8019' }}><Plus size={14} /></button>
                </div>
                <span style={{ minWidth: '56px', textAlign: 'right' }}>₹{item.price * item.qty}</span>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e43b4f' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', fontSize: '14px', color: '#3d4152', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Item Total</span><span>₹{subtotal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery Fee</span><span>₹{DELIVERY_FEE}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Platform Fee</span><span>₹{PLATFORM_FEE}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>GST</span><span>₹{gst}</span></div>
          </div>

          <div style={{ borderTop: '2px solid #e9e9eb', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
            <span>TO PAY</span>
            <span>₹{total}</span>
          </div>
          <button
            disabled={placing}
            onClick={handleCheckout}
            style={{ width: '100%', padding: '14px', backgroundColor: placing ? '#a3d9b1' : '#60b246', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '30px', cursor: placing ? 'not-allowed' : 'pointer', fontSize: '16px' }}
          >
            {placing ? 'PLACING ORDER...' : 'PROCEED TO PAY'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
