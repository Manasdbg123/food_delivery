import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useLocationState } from '../context/LocationContext';
import { getRestaurants } from '../services/catalog';
import { CUISINES } from '../data/catalog';
import { COUPONS } from '../lib/pricing';
import RestaurantCard from '../components/RestaurantCard';
import { EmptyState, Notice, RestaurantSkeleton } from '../components/ui';
import { clsx } from '../lib/format';

const SORTS = {
  relevance: { label: 'Relevance', fn: () => 0 },
  rating: { label: 'Rating', fn: (a, b) => b.rating - a.rating },
  time: { label: 'Delivery time', fn: (a, b) => a.avgDeliveryTimeMinutes - b.avgDeliveryTimeMinutes },
  costLow: { label: 'Cost: low to high', fn: (a, b) => (a.costForTwo || 0) - (b.costForTwo || 0) },
  costHigh: { label: 'Cost: high to low', fn: (a, b) => (b.costForTwo || 0) - (a.costForTwo || 0) },
};

const Home = () => {
  const { city } = useLocationState();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, restaurants: [], live: false });
  const [cuisine, setCuisine] = useState('');
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState({ veg: false, topRated: false, fast: false, offers: false });
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true }));
    getRestaurants(city, { signal: controller.signal })
      .then(({ data, live }) => setState({ loading: false, restaurants: data, live }))
      .catch((err) => err.name !== 'AbortError' && setState({ loading: false, restaurants: [], live: false }));
    return () => controller.abort();
  }, [city]);

  const visible = useMemo(() => state.restaurants
    .filter((r) => !cuisine || (r.cuisine || '').toLowerCase().includes(cuisine.toLowerCase()))
    .filter((r) => !filters.veg || r.veg)
    .filter((r) => !filters.topRated || r.rating >= 4.5)
    .filter((r) => !filters.fast || r.avgDeliveryTimeMinutes <= 30)
    .filter((r) => !filters.offers || r.offer)
    .sort(SORTS[sort].fn), [state.restaurants, cuisine, filters, sort]);

  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));
  const anyFilter = cuisine || Object.values(filters).some(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(900px 400px at 85% -10%, #fc5a12 0%, transparent 60%), radial-gradient(600px 300px at 0% 120%, #ff7a37 0%, transparent 60%)' }} />
        <div className="container-page relative grid gap-8 py-14 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
          <div>
            <p className="eyebrow text-brand-300">Delivering in {city}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              Hungry? Your favourite kitchen is a few taps away.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-300">Order from {state.restaurants.length || 'top'} restaurants near you and follow your order from the kitchen to your door.</p>
            <form
              className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl bg-white p-2 shadow-lift"
              onSubmit={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(query)}`); }}
            >
              <SearchIcon size={20} className="ml-2 shrink-0 text-ink-muted" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for biryani, dosa or a restaurant"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-ink placeholder:text-stone-400 focus:outline-none"
                aria-label="Search restaurants and dishes"
              />
              <button className="btn-primary shrink-0">Search</button>
            </form>
          </div>
          <div className="hidden gap-3 md:grid">
            {COUPONS.slice(0, 3).map((c, i) => (
              <Link key={c.code} to="/offers" className="animate-fade-up rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/10" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="text-lg font-bold text-white">{c.title}</p>
                <p className="text-sm text-stone-300">{c.detail} · use <span className="font-mono font-bold text-brand-300">{c.code}</span></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <section aria-labelledby="cuisines-title">
          <h2 id="cuisines-title" className="text-2xl font-extrabold">What's on your mind?</h2>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button className={clsx('chip', !cuisine && 'chip-active')} onClick={() => setCuisine('')}>All</button>
            {CUISINES.map((c) => (
              <button key={c} className={clsx('chip', cuisine === c && 'chip-active')} onClick={() => setCuisine(cuisine === c ? '' : c)}>{c}</button>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="list-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="list-title" className="text-2xl font-extrabold">Restaurants delivering in {city}</h2>
              {!state.loading && <p className="mt-1 text-sm text-ink-muted">{visible.length} of {state.restaurants.length} shown</p>}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <SlidersHorizontal size={16} /> Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto py-2">
                {Object.entries(SORTS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[['veg', 'Pure veg'], ['topRated', 'Rated 4.5+'], ['fast', 'Under 30 min'], ['offers', 'Offers']].map(([key, label]) => (
              <button key={key} className={clsx('chip', filters[key] && 'chip-active')} onClick={() => toggle(key)} aria-pressed={filters[key]}>{label}</button>
            ))}
          </div>

          {!state.loading && !state.live && (
            <div className="mt-5"><Notice>Showing sample restaurants. Start the backend to see live listings from restaurant-service.</Notice></div>
          )}

          <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {state.loading
              ? Array.from({ length: 6 }, (_, i) => <RestaurantSkeleton key={i} />)
              : visible.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
          </div>

          {!state.loading && visible.length === 0 && (
            <EmptyState
              icon={<SearchIcon size={28} />}
              title={anyFilter ? 'No restaurants match these filters' : `No restaurants in ${city} yet`}
              action={anyFilter && (
                <button className="btn-secondary" onClick={() => { setCuisine(''); setFilters({ veg: false, topRated: false, fast: false, offers: false }); }}>
                  Clear filters <ArrowRight size={16} />
                </button>
              )}
            >
              {anyFilter ? 'Try removing a filter to see more places.' : 'Pick another city from the location menu.'}
            </EmptyState>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
