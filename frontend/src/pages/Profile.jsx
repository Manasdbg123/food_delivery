import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Settings, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    // In production, clear auth tokens here
    navigate('/login');
  };

  const pastOrders = [
    { id: 'OD1298471', restaurant: 'Meghana Foods', date: 'June 05, 2026', items: '1 x Chicken Boneless Biryani', total: 340, status: 'Delivered' },
    { id: 'OD1298412', restaurant: 'Truffles', date: 'June 02, 2026', items: '2 x All American Cheese Burger, 1 x Classic Fudge Brownie', total: 630, status: 'Delivered' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', backgroundColor: '#fff', padding: '20px 0', border: '1px solid #e9e9eb', borderRadius: '12px', minHeight: '600px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #e9e9eb', marginBottom: '10px' }}>
          <h2 style={{ margin: '0', color: '#282c3f', fontSize: '24px' }}>Kaustuk</h2>
          <p style={{ margin: '5px 0 0 0', color: '#686b78', fontSize: '14px' }}>kaustuk@gmail.com • +91 9876543210</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Orders" />
          <TabButton active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} icon={<MapPin size={20} />} label="Addresses" />
          <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={<CreditCard size={20} />} label="Payments" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Settings" />
          <TabButton active={false} onClick={handleLogout} icon={<LogOut size={20} />} label="Logout" color="#e43b4f" />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', border: '1px solid #e9e9eb', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f', marginBottom: '25px' }}>Past Orders</h2>
            {pastOrders.map(order => (
              <div key={order.id} style={{ border: '1px solid #e9e9eb', borderRadius: '12px', padding: '20px', marginBottom: '20px', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed #d4d5d9', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#3d4152', fontSize: '18px' }}>{order.restaurant}</h3>
                    <p style={{ margin: 0, color: '#7e808c', fontSize: '13px' }}>Order #{order.id} | {order.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#f1f1f6', color: '#3d4152', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{order.status}</span>
                  </div>
                </div>
                <div style={{ color: '#3d4152', fontSize: '14px', marginBottom: '20px' }}>{order.items}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#3d4152', fontSize: '16px' }}>Total Bill: ₹{order.total}</span>
                  <button onClick={() => alert(`Reordering from ${order.restaurant}`)} style={{ padding: '8px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>REORDER</button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f' }}>Manage Addresses</h2>
            <div style={{ border: '1px dashed #d4d5d9', padding: '30px', textAlign: 'center', borderRadius: '8px', marginTop: '20px', color: '#fc8019', fontWeight: 'bold', cursor: 'pointer' }}>
              + ADD NEW ADDRESS
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f' }}>Payment Methods</h2>
            <p style={{ color: '#686b78' }}>No saved cards or UPI IDs found.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f' }}>Account Settings</h2>
            <p style={{ color: '#686b78' }}>Manage your email, password, and notification preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, color = '#3d4152' }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '18px 20px', backgroundColor: active ? '#f1f1f6' : 'transparent', 
      border: 'none', borderRight: active ? '4px solid #fc8019' : '4px solid transparent',
      cursor: 'pointer', textAlign: 'left', color: color, fontSize: '16px', fontWeight: active ? 'bold' : '500',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => { if(!active) e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
    onMouseOut={(e) => { if(!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      {icon} {label}
    </div>
    <ChevronRight size={18} style={{ opacity: active ? 1 : 0.4 }} />
  </button>
);

export default Profile;
