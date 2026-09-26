import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Star, X, ImageOff, Info } from 'lucide-react';
import { clsx } from '../lib/format';

// The square-in-square mark Indian menus use: green dot for veg, red triangle for non-veg.
export const VegMark = ({ isVeg, className = '' }) => (
  <span
    title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
    className={clsx('inline-grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-[1.5px]', isVeg ? 'border-veg' : 'border-nonveg', className)}
  >
    {isVeg
      ? <span className="h-2 w-2 rounded-full bg-veg" />
      : <span className="h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-nonveg" />}
  </span>
);

export const Rating = ({ value, count }) => (
  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
    <span className={clsx('grid h-5 w-5 place-items-center rounded-full text-white', value >= 4.3 ? 'bg-emerald-600' : 'bg-emerald-500')}>
      <Star size={11} fill="currentColor" strokeWidth={0} />
    </span>
    {Number(value || 0).toFixed(1)}
    {count ? <span className="font-normal text-ink-muted">({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})</span> : null}
  </span>
);

export const QtyStepper = ({ qty, onChange, size = 'md' }) => (
  <div className={clsx('inline-flex items-center overflow-hidden rounded-xl border border-stone-300 bg-white font-bold text-emerald-700 shadow-sm', size === 'sm' ? 'h-8' : 'h-10')}>
    <button type="button" onClick={() => onChange(qty - 1)} className="grid h-full w-9 place-items-center hover:bg-stone-50" aria-label="Remove one">
      <Minus size={14} strokeWidth={3} />
    </button>
    <span className="min-w-[1.75rem] text-center tabular-nums text-ink" aria-live="polite">{qty}</span>
    <button type="button" onClick={() => onChange(qty + 1)} className="grid h-full w-9 place-items-center hover:bg-stone-50" aria-label="Add one">
      <Plus size={14} strokeWidth={3} />
    </button>
  </div>
);

// An image that degrades to a tinted panel with the name's initial instead of a
// broken-image icon when the URL fails.
export const SmartImage = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed) {
    return (
      <div className={clsx('grid place-items-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700', className)} role="img" aria-label={alt}>
        {alt ? <span className="text-3xl font-extrabold">{alt.charAt(0)}</span> : <ImageOff size={24} />}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={clsx('object-cover', className)} />;
};

export const EmptyState = ({ icon, title, children, action }) => (
  <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
    {icon && <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">{icon}</div>}
    <h2 className="text-xl font-bold">{title}</h2>
    {children && <p className="mt-2 text-ink-muted">{children}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const Notice = ({ children, tone = 'info' }) => (
  <div className={clsx(
    'flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm',
    tone === 'warn' ? 'bg-amber-50 text-amber-900' : 'bg-sky-50 text-sky-900',
  )}>
    <Info size={16} className="mt-0.5 shrink-0" />
    <div>{children}</div>
  </div>
);

export const Modal = ({ open, onClose, title, children, footer }) => {
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1500] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md animate-fade-up rounded-3xl bg-white p-6 shadow-lift outline-none">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-muted hover:bg-stone-100 hover:text-ink" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="text-ink-soft">{children}</div>
        {footer && <div className="mt-6 flex gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export const RestaurantSkeleton = () => (
  <div className="overflow-hidden rounded-2xl">
    <div className="skeleton aspect-[16/10] rounded-2xl" />
    <div className="space-y-2 px-1 pt-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  </div>
);
