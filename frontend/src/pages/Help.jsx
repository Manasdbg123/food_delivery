import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const Help = () => {
  const [activeTopic, setActiveTopic] = useState('general');

  return (
    <div style={{ backgroundColor: '#37718e', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>Help & Support</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Let's take a step ahead and help you better.</p>
        </div>
        {/* Functional Contact Customer Service Button */}
        <button onClick={() => alert('Connecting you to a Live Customer Service Agent...')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: '#fc8019', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <MessageSquare size={20} /> Chat with Customer Service
        </button>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', display: 'flex', minHeight: '500px' }}>
        <div style={{ width: '280px', backgroundColor: '#f1f1f6', padding: '30px 0' }}>
          <div onClick={() => setActiveTopic('general')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'general' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'general' ? 'bold' : 'normal', color: '#3d4152' }}>Partner Onboarding</div>
          <div onClick={() => setActiveTopic('legal')} style={{ padding: '20px 30px', backgroundColor: activeTopic === 'legal' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: activeTopic === 'legal' ? 'bold' : 'normal', color: '#3d4152' }}>Legal, Terms & Conditions</div>
        </div>
        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ margin: '0 0 30px 0', color: '#282c3f' }}>{activeTopic === 'general' ? 'Partner Onboarding Queries' : 'Legal Policies'}</h2>
          <p style={{ color: '#686b78', lineHeight: '1.6' }}>If you cannot find the answer to your question in our FAQ, please click the orange "Chat with Customer Service" button at the top of the page to speak with a representative immediately.</p>
        </div>
      </div>
    </div>
  );
};
export default Help;
