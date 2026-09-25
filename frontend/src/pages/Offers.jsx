import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Percent, Tag } from 'lucide-react';
import { COUPONS } from '../lib/pricing';
import { RESTAURANTS } from '../data/catalog';
import { useLocationState } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import RestaurantCard from '../components/RestaurantCard';

const Offers = () => {
  const { city } = useLocationState();
  const { showToast } = useToast();
  const cart = useCart();
  const withOffers = RESTAURANTS.filter((r) => r.city === city && r.offer);

  const copy = async (code) => {
    cart.applyCoupon(code);
    try { await navigator.clipboard.writeText(code); } catch { /* clipboard blocked; applying is enough */ }
    showToast(`${code} copied and added to your cart`, 'success');
  };

  return (
    <div className="container-page py-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white sm:p-12">
        <Percent size={180} className="absolute -right-6 -top-6 opacity-10" />
        <p className="eyebrow text-brand-100">Offers for you</p>
        <h1 className="mt-2 max-w-xl text-4xl font-extrabold text-white">Save on every order, every day</h1>
        <p className="mt-3 max-w-lg text-brand-50">Tap a code to apply it to your cart. The best one is checked again at checkout.</p>
      </section>

      <section className="mt-10" aria-labelledby="codes-title">
        <h2 id="codes-title" className="text-2xl font-extrabold">Coupon codes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {COUPONS.map((c) => (
            <article key={c.code} className="card flex flex-col p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Tag size={20} /></span>
              <h3 className="mt-4 text-xl font-extrabold">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-muted">{c.detail}</p>
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 px-4 py-2.5">
                <span className="font-mono text-lg font-extrabold tracking-wider text-brand-700">{c.code}</span>
                <button className="btn-ghost px-2 py-1.5 text-brand-700" onClick={() => copy(c.code)}><Copy size={16} /> Use</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="deals-title">
        <h2 id="deals-title" className="text-2xl font-extrabold">Restaurant deals in {city}</h2>
        {withOffers.length ? (
          <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {withOffers.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
          </div>
        ) : (
          <p className="mt-4 text-ink-muted">No restaurant deals in {city} today. The coupon codes above work everywhere. <Link to="/" className="font-semibold text-brand-600">Browse restaurants</Link></p>
        )}
      </section>
    </div>
  );
};

export default Offers;
