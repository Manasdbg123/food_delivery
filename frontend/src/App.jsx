import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import OrderTracking from './pages/OrderTracking';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/dineout" element={<ProtectedRoute><Dineout /></ProtectedRoute>} />
                        <Route path="/support" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                        <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
                        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                        <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                        <Route path="/order-tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                } />
              </Routes>
            </Router>
          </CartProvider>
        </LocationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
export default App;
