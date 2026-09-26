import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-ink lg:block">
      <img
        src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=70"
        alt="" className="absolute inset-0 h-full w-full object-cover opacity-60"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute bottom-0 p-12 text-white">
        <p className="text-4xl font-extrabold leading-tight text-white">Biryani at midnight.<br />Dosa at dawn.</p>
        <p className="mt-3 max-w-md text-stone-300">15 kitchens across 5 cities, with live tracking from the pan to your door.</p>
      </div>
    </div>
    <div className="flex flex-col px-6 py-8 sm:px-12">
      <Link to="/" className="self-start" aria-label="FoodieHub home"><Logo /></Link>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
