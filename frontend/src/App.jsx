import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RestaurantMenu from './pages/RestaurantMenu';
import Search from './pages/Search';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 80px)' }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
