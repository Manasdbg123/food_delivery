import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Dashboard';

// Everything but the landing page loads on demand, keeping the first paint small.
const RestaurantMenu = lazy(() => import('./pages/RestaurantMenu'));
const Search = lazy(() => import('./pages/Search'));
const Offers = lazy(() => import('./pages/Offers'));
const Dineout = lazy(() => import('./pages/Dineout'));
const Help = lazy(() => import('./pages/Help'));
const Cart = lazy(() => import('./pages/Cart'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const PageFallback = () => (
  <div className="container-page py-10">
    <div className="skeleton h-8 w-64" />
    <div className="skeleton mt-4 h-4 w-96 max-w-full" />
  </div>
);

const Shell = ({ children }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </main>
    <Footer />
  </div>
);

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <LocationProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={
                  <Shell>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Home />} />
                      <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/dineout" element={<Dineout />} />
                      <Route path="/support" element={<Help />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Shell>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </LocationProvider>
    </ToastProvider>
  </AuthProvider>
);

export default App;
