import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Home, MapPin, ShieldCheck, ShoppingBag, Smartphone, Tag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { placeOrder } from '../services/orders';
import { COUPONS, FREE_DELIVERY_ABOVE, couponProblem, findCoupon } from '../lib/pricing';
import { EmptyState, QtyStepper, SmartImage, VegMark } from '../components/ui';
import { clsx, inr } from '../lib/format';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', detail: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'CARD', label: 'Credit or debit card', detail: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'COD', label: 'Cash on delivery', detail: 'Pay the delivery partner', icon: Banknote },
];

const ADDRESS_KEY = 'foodiehub_address';
const readAddress = () => {
  try { return JSON.parse(localStorage.getItem(ADDRESS_KEY)) || null; } catch { return null; }
};

const Row = ({ label, value, strong, positive }) => (
  <div className={clsx('flex justify-between', strong ? 'text-base font-extrabold' : 'text-sm text-ink-soft')}>
    <span>{label}</span>
    <span className={clsx('tabular-nums', positive && 'font-semibold text-emerald-700')}>{value}</span>
  </div>
);

const Cart = () => {
  const cart = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState(() => readAddress() || { label: 'Home', line1: '', area: '', landmark: '' });
  const [payment, setPayment] = useState('UPI');
  const [couponInput, setCouponInput] = useState(cart.couponCode);
  const [couponError, setCouponError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  if (cart.itemCount === 0) {
    return (
      <EmptyState icon={<ShoppingBag size={28} />} title="Your cart is empty" action={<Link to="/" className="btn-primary">Find something to eat</Link>}>
        Good food is always cooking. Browse the restaurants near you.
      </EmptyState>
    );
  }

  const { bill } = cart;
  const addressComplete = address.line1.trim().length >= 3 && address.area.trim().length >= 2;

  const applyCoupon = (code) => {
    const coupon = findCoupon(code);
    const problem = couponProblem(coupon, cart.subtotal);
    setCouponInput(code);
    if (problem) { setCouponError(problem); return; }
    setCouponError('');
    cart.applyCoupon(coupon.code);
    showToast(`${coupon.code} applied`, 'success', 1800);
  };

  const submit = async () => {
    setError('');
    if (!addressComplete) { setError('Add your flat or house number and area so we know where to deliver.'); return; }
    setPlacing(true);
    try {
      try { localStorage.setItem(ADDRESS_KEY, JSON.stringify(address)); } catch { /* ignore */ }
      const order = await placeOrder({
        restaurant: cart.restaurant,
        items: cart.items,
        address: [address.line1, address.area, address.landmark && `near ${address.landmark}`, cart.restaurant.city].filter(Boolean).join(', '),
        paymentMethod: payment,
        couponCode: bill.coupon?.code,
        bill,
      });
      cart.clear();
      showToast(order.demo ? 'Order placed in demo mode' : 'Order placed', 'success');
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="addr-title">
            <h2 id="addr-title" className="flex items-center gap-2 text-lg font-bold"><MapPin size={20} className="text-brand-500" /> Delivery address</h2>
            <div className="mt-4 flex gap-2">
              {['Home', 'Work', 'Other'].map((label) => (
                <button key={label} type="button" onClick={() => setAddress((a) => ({ ...a, label }))} className={clsx('chip', address.label === label && 'chip-active')}>
                  {label === 'Home' && <Home size={14} />} {label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="label">Flat, house number, building</span>
                <input id="addr-line1" className="input" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="e.g. Flat 402, Palm Residency" autoComplete="address-line1" />
              </label>
              <label>
                <span className="label">Area</span>
                <input id="addr-area" className="input" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} placeholder={cart.restaurant.area || 'Area or locality'} autoComplete="address-line2" />
              </label>
              <label>
                <span className="label">Landmark <span className="font-normal text-ink-muted">(optional)</span></span>
                <input id="addr-landmark" className="input" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} placeholder="e.g. opposite the metro station" />
              </label>
            </div>
            <p className="mt-3 text-sm text-ink-muted">Delivering in {cart.restaurant.city || 'your city'}.</p>
          </section>

          <section className="card p-6" aria-labelledby="pay-title">
            <h2 id="pay-title" className="flex items-center gap-2 text-lg font-bold"><CreditCard size={20} className="text-brand-500" /> Payment</h2>
            <div className="mt-4 grid gap-3" role="radiogroup">
              {PAYMENT_METHODS.map(({ id, label, detail, icon: Icon }) => (
                <label key={id} className={clsx('flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition', payment === id ? 'border-brand-500 bg-brand-50/60 ring-4 ring-brand-100' : 'border-stone-200 hover:border-stone-300')}>
                  <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="sr-only" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink shadow-sm"><Icon size={20} /></span>
                  <span className="flex-1">
                    <span className="block font-bold">{label}</span>
                    <span className="block text-sm text-ink-muted">{detail}</span>
                  </span>
                  <span className={clsx('h-5 w-5 rounded-full border-2', payment === id ? 'border-[6px] border-brand-500' : 'border-stone-300')} />
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted"><ShieldCheck size={16} className="text-emerald-600" /> Payment is confirmed by payment-service before the restaurant starts cooking.</p>
          </section>
        </div>

        <aside className="card sticky top-20 p-6" aria-label="Order summary">
          <div className="flex items-center gap-3">
            <SmartImage src={cart.restaurant.imageUrl} alt={cart.restaurant.name} className="h-14 w-14 rounded-xl" />
            <div className="min-w-0">
              <p className="truncate font-bold">{cart.restaurant.name}</p>
              <p className="truncate text-sm text-ink-muted">{cart.restaurant.area}{cart.restaurant.avgDeliveryTimeMinutes ? ` · ${cart.restaurant.avgDeliveryTimeMinutes} min` : ''}</p>
            </div>
          </div>

          <ul className="mt-5 space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <VegMark isVeg={item.isVeg} />
                <span className="min-w-0 flex-1 text-sm font-medium">{item.name}</span>
                <QtyStepper size="sm" qty={item.qty} onChange={(n) => cart.setQty(item.id, n)} />
                <span className="w-16 text-right text-sm font-semibold tabular-nums">{inr(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 p-4">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); applyCoupon(couponInput); }}>
              <label className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input className="input pl-9 uppercase" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
              </label>
              <button className="btn-secondary" disabled={!couponInput.trim()}>Apply</button>
            </form>
            {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
            {bill.coupon ? (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-emerald-700">{bill.coupon.code} applied · {bill.coupon.title}</span>
                <button className="text-ink-muted hover:text-red-600" onClick={() => { cart.applyCoupon(''); setCouponInput(''); }} aria-label="Remove coupon"><Trash2 size={15} /></button>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {COUPONS.map((c) => (
                  <button key={c.code} className="rounded-lg bg-stone-100 px-2 py-1 font-mono text-xs font-bold text-ink-soft hover:bg-brand-50 hover:text-brand-700" onClick={() => applyCoupon(c.code)}>{c.code}</button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2.5">
            <Row label="Item total" value={inr(bill.subtotal)} />
            {bill.discount > 0 && <Row label="Coupon discount" value={`− ${inr(bill.discount)}`} positive />}
            <Row label="Delivery fee" value={bill.deliveryFee ? inr(bill.deliveryFee) : 'Free'} positive={!bill.deliveryFee} />
            <Row label="Platform fee" value={inr(bill.platformFee)} />
            <Row label="GST (5%)" value={inr(bill.gst)} />
            <div className="border-t border-stone-200 pt-3"><Row label="To pay" value={inr(bill.total)} strong /></div>
            {bill.deliveryFee > 0 && cart.subtotal < FREE_DELIVERY_ABOVE && (
              <p className="text-xs text-ink-muted">Add {inr(FREE_DELIVERY_ABOVE - cart.subtotal)} more for free delivery.</p>
            )}
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}

          {isAuthenticated ? (
            <button className="btn-primary btn-lg mt-5 w-full bg-emerald-600 hover:bg-emerald-700" onClick={submit} disabled={placing}>
              {placing ? 'Placing your order…' : `Place order · ${inr(bill.total)}`}
            </button>
          ) : (
            <Link to="/login" state={{ from: { pathname: '/cart' } }} className="btn-primary btn-lg mt-5 w-full">Sign in to place your order</Link>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Cart;
