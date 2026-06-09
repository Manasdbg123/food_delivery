import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RestaurantMenu from './pages/RestaurantMenu';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dineout from './pages/Dineout';
import Help from './pages/Help';
import Footer from './components/Footer';

function App() {
  return (
    <LocationProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ backgroundColor: '#fff', flex: 1 }}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dineout" element={<Dineout />} />
                    <Route path="/support" element={<Help />} />
                    <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </LocationProvider>
  );
}
export default App;
