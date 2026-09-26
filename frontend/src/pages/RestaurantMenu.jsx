import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, IndianRupee, MapPin, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getMenu, getRestaurant } from '../services/catalog';
import { EmptyState, Modal, Notice, QtyStepper, Rating, SmartImage, VegMark } from '../components/ui';
import { clsx, inr } from '../lib/format';

const RestaurantMenu = () => {
  const { id } = useParams();
  const cart = useCart();
  const { showToast } = useToast();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({ items: [], live: false });
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([getRestaurant(id, controller), getMenu(id, controller)])
      .then(([r, m]) => {
        setRestaurant(r.data);
        setMenu({ items: m.data, live: m.live && r.live });
      })
      .catch(() => {})
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [id]);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = menu.items
      .filter((i) => !vegOnly || i.isVeg)
      .filter((i) => !q || i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
    const groups = new Map();
    const best = items.filter((i) => i.bestseller);
    if (best.length && !q) groups.set('Bestsellers', best);
    for (const item of items) {
      const key = item.category || 'Menu';
      groups.set(key, [...(groups.get(key) || []), item]);
    }
    return [...groups.entries()];
  }, [menu.items, vegOnly, query]);

  if (loading) {
    return (
      <div className="container-page max-w-4xl py-8">
        <div className="skeleton h-48 w-full rounded-3xl" />
        <div className="mt-6 space-y-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-24" />)}</div>
      </div>
    );
  }

  if (!restaurant) {
    return <EmptyState title="Restaurant not found" action={<Link to="/" className="btn-primary">Browse restaurants</Link>}>It may have closed or moved.</EmptyState>;
  }

  const add = (item) => {
    if (cart.add(item, restaurant) === 'conflict') setPending(item);
    else showToast(`${item.name} added to your cart`, 'success', 1800);
  };

  const inThisCart = cart.restaurant?.id === restaurant.id && cart.itemCount > 0;

  return (
    <div className="container-page max-w-4xl pb-32 pt-6">
      <nav className="mb-4 text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link> / <span>{restaurant.city}</span> / <span className="text-ink">{restaurant.name}</span>
      </nav>

      <header className="card overflow-hidden">
        <div className="grid sm:grid-cols-[1fr_260px]">
          <div className="p-6">
            <h1 className="text-3xl font-extrabold">{restaurant.name}</h1>
            <p className="mt-1 text-ink-muted">{restaurant.cuisine}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <Rating value={restaurant.rating} count={restaurant.ratingCount} />
              <span className="inline-flex items-center gap-1.5 font-semibold"><Clock size={15} /> {restaurant.avgDeliveryTimeMinutes} min</span>
              {restaurant.costForTwo && <span className="inline-flex items-center gap-1 font-semibold"><IndianRupee size={14} />{restaurant.costForTwo} for two</span>}
              <span className="inline-flex items-center gap-1.5 text-ink-muted"><MapPin size={15} /> {restaurant.area || restaurant.address || restaurant.city}</span>
            </div>
            {restaurant.offer && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
                <Sparkles size={15} /> {restaurant.offer}
              </p>
            )}
          </div>
          <SmartImage src={restaurant.imageUrl} alt={restaurant.name} className="hidden h-full w-full sm:block" />
        </div>
      </header>

      {!menu.live && <div className="mt-4"><Notice>This is the sample menu. Prices and availability come from menu-service when the backend is running.</Notice></div>}

      <div className="sticky top-16 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-3 bg-stone-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl">
        <label className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input pl-10" placeholder="Search the menu" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the menu" />
        </label>
        {!restaurant.veg && (
          <button className={clsx('chip', vegOnly && 'border-veg bg-green-50 text-veg')} onClick={() => setVegOnly((v) => !v)} aria-pressed={vegOnly}>
            <VegMark isVeg /> Veg only
          </button>
        )}
      </div>

      {sections.length === 0 && <EmptyState title="Nothing matches">Try another dish name{vegOnly ? ' or turn off Veg only' : ''}.</EmptyState>}

      {sections.map(([title, items]) => (
        <section key={title} className="mt-8" aria-labelledby={`sec-${title}`}>
          <h2 id={`sec-${title}`} className="text-xl font-extrabold">{title} <span className="font-semibold text-ink-muted">({items.length})</span></h2>
          <ul className="mt-2 divide-y divide-stone-200">
            {items.map((item) => {
              const qty = cart.restaurant?.id === restaurant.id ? cart.quantityOf(item.id) : 0;
              return (
                <li key={`${title}-${item.id}`} className="flex gap-6 py-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <VegMark isVeg={item.isVeg} />
                      {item.bestseller && <span className="text-xs font-bold text-brand-600">★ Bestseller</span>}
                    </div>
                    <h3 className="mt-1.5 text-lg font-bold">{item.name}</h3>
                    <p className="font-semibold">{inr(item.price)}</p>
                    {item.description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{item.description}</p>}
                  </div>
                  <div className="flex w-32 shrink-0 flex-col items-center justify-center gap-2">
                    {qty > 0
                      ? <QtyStepper qty={qty} onChange={(n) => cart.setQty(item.id, n)} />
                      : <button onClick={() => add(item)} className="h-10 w-full rounded-xl border border-stone-300 bg-white text-sm font-extrabold text-emerald-700 shadow-sm transition hover:bg-emerald-50">ADD</button>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {inThisCart && (
        <div className="fixed inset-x-0 bottom-0 z-20 p-4">
          <Link to="/cart" className="mx-auto flex max-w-4xl animate-fade-up items-center justify-between rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-lift hover:bg-emerald-700">
            <span className="inline-flex items-center gap-2"><ShoppingBag size={18} /> {cart.itemCount} item{cart.itemCount > 1 ? 's' : ''} · {inr(cart.subtotal)}</span>
            <span className="inline-flex items-center gap-1">View cart <ArrowRight size={18} /></span>
          </Link>
        </div>
      )}

      <Modal
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title="Start a new cart?"
        footer={<>
          <button className="btn-secondary flex-1" onClick={() => setPending(null)}>Keep current cart</button>
          <button className="btn-primary flex-1" onClick={() => { cart.replaceWith(pending, restaurant); showToast(`New cart started with ${pending.name}`, 'info'); setPending(null); }}>Start new cart</button>
        </>}
      >
        Your cart has items from <strong>{cart.restaurant?.name}</strong>. Adding this will clear it and start a new order from {restaurant.name}.
      </Modal>
    </div>
  );
};

export default RestaurantMenu;
