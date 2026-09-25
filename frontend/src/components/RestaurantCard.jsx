import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Leaf } from 'lucide-react';
import { Rating, SmartImage } from './ui';
import { inr } from '../lib/format';

const RestaurantCard = ({ restaurant: r, index = 0 }) => (
  <Link
    to={`/restaurant/${r.id}`}
    className="group block animate-fade-up rounded-2xl focus-visible:ring-offset-4"
    style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
  >
    <div className="relative overflow-hidden rounded-2xl shadow-card">
      <SmartImage src={r.imageUrl} alt={r.name} className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.04]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      {r.offer && (
        <span className="absolute bottom-3 left-3 text-lg font-extrabold uppercase tracking-tight text-white drop-shadow">{r.offer}</span>
      )}
      {r.veg && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-veg">
          <Leaf size={12} /> Pure veg
        </span>
      )}
    </div>
    <div className="px-1 pt-3">
      <h3 className="truncate text-lg font-bold group-hover:text-brand-600">{r.name}</h3>
      <div className="mt-0.5 flex items-center gap-2 text-sm text-ink-soft">
        <Rating value={r.rating} />
        <span className="text-stone-300">•</span>
        <span className="inline-flex items-center gap-1 font-semibold"><Clock size={14} /> {r.avgDeliveryTimeMinutes} min</span>
      </div>
      <p className="mt-1 truncate text-sm text-ink-muted">{r.cuisine}</p>
      <p className="truncate text-sm text-ink-muted">
        {r.area}{r.costForTwo ? ` · ${inr(r.costForTwo)} for two` : ''}
      </p>
    </div>
  </Link>
);

export default RestaurantCard;
