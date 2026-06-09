import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Settings, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '280px', backgroundColor: '#fff', border: '1px solid #e9e9eb', minHeight: '600px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e9e9eb' }}>
          <h2 style={{ margin: '0', color: '#282c3f', fontSize: '24px' }}>Kaustuk</h2>
          <p style={{ margin: '5px 0 0 0', color: '#686b78', fontSize: '14px' }}>kaustuk@gmail.com</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Orders" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="Settings" />
          <TabButton active={false} onClick={() => navigate('/login')} icon={<LogOut size={20} />} label="Logout" color="#e43b4f" />
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', border: '1px solid #e9e9eb' }}>
        {activeTab === 'orders' && <h2 style={{ marginTop: 0, color: '#282c3f' }}>Past Orders (Empty)</h2>}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#282c3f', marginBottom: '20px' }}>Edit Account Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Profile Updated Successfully!'); }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Full Name</label>
                <input type="text" defaultValue="Kaustuk" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Email Address</label>
                <input type="email" defaultValue="kaustuk@gmail.com" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#686b78' }}>Phone Number</label>
                <input type="tel" defaultValue="+91 9876543210" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', outline: 'none' }} />
              </div>
              <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>UPDATE PROFILE</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, color = '#3d4152' }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', backgroundColor: active ? '#f1f1f6' : 'transparent', border: 'none', borderRight: active ? '4px solid #fc8019' : '4px solid transparent', cursor: 'pointer', textAlign: 'left', color: color, fontSize: '16px', fontWeight: active ? 'bold' : '500' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>{icon} {label}</div>
    <ChevronRight size={18} style={{ opacity: active ? 1 : 0.4 }} />
  </button>
);
export default Profile;
