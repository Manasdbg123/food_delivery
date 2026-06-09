import React from 'react';

const Footer = () => (
  <footer style={{ backgroundColor: '#02060c', color: '#fff', padding: '60px 0', marginTop: 'auto', fontFamily: 'sans-serif' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', padding: '0 20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" alt="Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px' }}>FoodExpress</span>
        </div>
        <p style={{ color: '#808080', fontSize: '14px' }}>© 2026 Bundl Technologies Pvt. Ltd</p>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Company</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>About Us</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Careers</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Team</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Swiggy One</li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Contact us</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Help & Support</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Partner with us</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Ride with us</li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Legal</h4>
        <ul style={{ listStyle: 'none', padding: 0, color: '#808080', fontSize: '15px', lineHeight: '2.5', cursor: 'pointer' }}>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Terms & Conditions</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Cookie Policy</li>
          <li onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#808080'}>Privacy Policy</li>
        </ul>
      </div>
    </div>
  </footer>
);
export default Footer;
