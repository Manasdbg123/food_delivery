import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle, LogOut, MapPin, Menu, Percent, Search, ShoppingBag, User, UtensilsCrossed, X, Receipt } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocationState } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { clsx } from '../lib/format';

const LINKS = [
  { to: '/search', label: 'Search', icon: Search },
  { to: '/offers', label: 'Offers', icon: Percent },
  { to: '/dineout', label: 'Dineout', icon: UtensilsCrossed },
  { to: '/support', label: 'Help', icon: HelpCircle },
];

const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && onOutside();
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onOutside]);
};

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { city, setCity, cities } = useLocationState();
  const { isAuthenticated, user, logout } = useAuth();
  const [cityOpen, setCityOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cityRef = useRef(null);
  const accountRef = useRef(null);
  useClickOutside(cityRef, () => setCityOpen(false));
  useClickOutside(accountRef, () => setAccountOpen(false));
  useEffect(() => { setMobileOpen(false); setAccountOpen(false); }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) => clsx(
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
    isActive ? 'text-brand-600' : 'text-ink-soft hover:text-ink',
  );

  return (
    <header className="sticky top-0 z-[1000] border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" aria-label="FoodieHub home"><Logo /></Link>

        <div ref={cityRef} className="relative hidden sm:block">
          <button
            onClick={() => setCityOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm hover:bg-stone-100"
            aria-haspopup="listbox" aria-expanded={cityOpen}
          >
            <MapPin size={16} className="text-brand-500" />
            <span className="font-bold text-ink">{city}</span>
            <ChevronDown size={16} className={clsx('text-ink-muted transition', cityOpen && 'rotate-180')} />
          </button>
          {cityOpen && (
            <ul role="listbox" className="absolute left-0 top-12 w-56 animate-fade-up rounded-2xl border border-stone-200 bg-white p-1.5 shadow-lift">
              <li className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-ink-muted">Deliver to</li>
              {cities.map((c) => (
                <li key={c}>
                  <button
                    role="option" aria-selected={city === c}
                    onClick={() => { setCity(c); setCityOpen(false); navigate('/'); }}
                    className={clsx('flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm', city === c ? 'bg-brand-50 font-bold text-brand-700' : 'hover:bg-stone-50')}
                  >
                    <MapPin size={14} /> {c}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}><Icon size={17} /> {label}</NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <NavLink to="/cart" className={linkClass} aria-label={`Cart, ${itemCount} items`}>
            <span className="relative">
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white">{itemCount}</span>
              )}
            </span>
            <span className="hidden lg:inline">Cart</span>
          </NavLink>

          {isAuthenticated ? (
            <div ref={accountRef} className="relative hidden md:block">
              <button onClick={() => setAccountOpen((o) => !o)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-stone-100" aria-haspopup="menu" aria-expanded={accountOpen}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                  {(user?.firstName || user?.email || '?').charAt(0).toUpperCase()}
                </span>
                <ChevronDown size={16} className="text-ink-muted" />
              </button>
              {accountOpen && (
                <div role="menu" className="absolute right-0 top-12 w-60 animate-fade-up rounded-2xl border border-stone-200 bg-white p-1.5 shadow-lift">
                  <div className="px-3 py-2.5">
                    <p className="truncate font-bold">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Your account'}</p>
                    <p className="truncate text-sm text-ink-muted">{user?.email}</p>
                  </div>
                  <Link role="menuitem" to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-50"><User size={16} /> Profile</Link>
                  <Link role="menuitem" to="/profile?tab=orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-50"><Receipt size={16} /> Orders</Link>
                  <button role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" state={{ from: { pathname } }} className="btn-primary ml-1 hidden md:inline-flex">Sign in</Link>
          )}

          <button className="rounded-xl p-2 hover:bg-stone-100 md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-up border-t border-stone-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {cities.map((c) => (
                <button key={c} onClick={() => { setCity(c); navigate('/'); }} className={clsx('chip', city === c && 'chip-active')}>{c}</button>
              ))}
            </div>
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}><Icon size={18} /> {label}</NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={linkClass}><User size={18} /> Profile & orders</NavLink>
                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600"><LogOut size={18} /> Sign out</button>
              </>
            ) : (
              <Link to="/login" className="btn-primary mt-2">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
