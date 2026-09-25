import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { useLocationState } from '../context/LocationContext';
import { search } from '../services/catalog';
import RestaurantCard from '../components/RestaurantCard';
import { EmptyState, VegMark } from '../components/ui';
import { clsx, inr } from '../lib/format';

const POPULAR = ['Biryani', 'Dosa', 'Burger', 'Pizza', 'Kebab', 'Paneer', 'Brownie', 'Coffee'];

const Search = () => {
  const { city } = useLocationState();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [tab, setTab] = useState('dishes');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    const next = new URLSearchParams(params);
    if (q) next.set('q', q); else next.delete('q');
    setParams(next, { replace: true });
    if (!q) { setResults(null); return undefined; }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      search(q, city, { signal: controller.signal })
        .then((r) => {
          setResults(r);
          setTab((t) => (t === 'dishes' && !r.dishes.length && r.restaurants.length ? 'restaurants' : t));
        })
        .catch(() => {})
        .finally(() => !controller.signal.aborted && setLoading(false));
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, city]);

  const counts = { dishes: results?.dishes.length || 0, restaurants: results?.restaurants.length || 0 };

  return (
    <div className="container-page max-w-4xl py-8">
      <h1 className="text-3xl font-extrabold">Search</h1>
      <p className="mt-1 text-ink-muted">Dishes and restaurants in {city}</p>

      <label className="relative mt-6 block">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a dish or a restaurant"
          className="input h-14 rounded-2xl pl-12 pr-12 text-base shadow-card" aria-label="Search"
        />
        {query && (
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-muted hover:bg-stone-100" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>
        )}
      </label>

      {!query.trim() && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">Popular right now</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR.map((p) => <button key={p} className="chip" onClick={() => setQuery(p)}>{p}</button>)}
          </div>
        </section>
      )}

      {query.trim() && (
        <>
          <div className="mt-6 flex gap-2" role="tablist">
            {['dishes', 'restaurants'].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={clsx('chip capitalize', tab === t && 'chip-active')} onClick={() => setTab(t)}>
                {t} <span className="opacity-70">{counts[t]}</span>
              </button>
            ))}
          </div>

          {loading && !results && <div className="mt-6 space-y-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-20" />)}</div>}

          {results && tab === 'dishes' && (
            results.dishes.length ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {results.dishes.map((d) => (
                  <li key={d.id}>
                    <Link to={`/restaurant/${d.restaurant.id}`} className="card flex h-full items-start gap-3 p-4 transition hover:shadow-lift">
                      <VegMark isVeg={d.isVeg} className="mt-1" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{d.name}</p>
                        <p className="text-sm font-semibold">{inr(d.price)}</p>
                        <p className="mt-1 truncate text-sm text-ink-muted">{d.restaurant.name} · {d.restaurant.area}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <EmptyState title={`No dishes called “${query}”`}>Try a broader word, like “chicken” or “dosa”.</EmptyState>
          )}

          {results && tab === 'restaurants' && (
            results.restaurants.length ? (
              <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2">
                {results.restaurants.map((r, i) => <RestaurantCard key={r.id} restaurant={r} index={i} />)}
              </div>
            ) : <EmptyState title={`No restaurants match “${query}”`}>Search by name, cuisine or neighbourhood.</EmptyState>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
