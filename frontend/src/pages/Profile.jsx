import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, LogOut, Receipt, RotateCcw, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { listOrders, STATUSES } from '../services/orders';
import { EmptyState, Notice } from '../components/ui';
import { clsx, inr, timeAgo } from '../lib/format';
import { api } from '../lib/api';
import { RESTAURANTS } from '../data/catalog';

const STATUS_STYLE = {
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-stone-100 text-stone-600',
  PAYMENT_FAILED: 'bg-red-50 text-red-700',
};
const statusLabel = (s) => STATUSES.find((x) => x.key === s)?.label || s.replace(/_/g, ' ').toLowerCase();

const Orders = () => {
  const [state, setState] = useState({ loading: true, orders: [], live: true });
  const cart = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => { listOrders().then(({ orders, live }) => setState({ loading: false, orders, live })); }, []);

  const reorder = (order) => {
    if (!order.items?.length) return;
    const restaurant = RESTAURANTS.find((r) => r.id === order.restaurantId) || { id: order.restaurantId, name: order.restaurantName || 'Restaurant' };
    cart.loadOrder(restaurant, order.items.map((i) => ({ id: i.menuItemId, name: i.name, price: i.price, isVeg: i.isVeg, qty: i.quantity })));
    showToast('Items added to your cart', 'success');
    navigate('/cart');
  };

  if (state.loading) return <div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton h-24" />)}</div>;
  if (!state.orders.length) {
    return <EmptyState icon={<Receipt size={28} />} title="No orders yet" action={<Link to="/" className="btn-primary">Order something</Link>}>Your orders will appear here with live status.</EmptyState>;
  }
  return (
    <div className="space-y-4">
      {!state.live && <Notice>The backend is not running, so only demo orders from this browser are shown.</Notice>}
      {state.orders.map((o) => (
        <article key={o.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold">{o.restaurantName || `Restaurant #${o.restaurantId}`}</h3>
              <p className="text-sm text-ink-muted">{o.demo ? 'Demo order' : `Order #${o.id}`} · {timeAgo(o.createdAt)}</p>
            </div>
            <span className={clsx('rounded-full px-3 py-1 text-xs font-bold capitalize', STATUS_STYLE[o.status] || 'bg-brand-50 text-brand-700')}>{statusLabel(o.status)}</span>
          </div>
          {o.items?.length > 0 && <p className="mt-3 line-clamp-1 text-sm text-ink-soft">{o.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</p>}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
            <span className="font-extrabold">{inr(o.totalAmount)}</span>
            <span className="flex gap-2">
              {o.items?.length > 0 && <button className="btn-secondary py-2" onClick={() => reorder(o)}><RotateCcw size={15} /> Reorder</button>}
              <Link to={`/orders/${o.id}`} className="btn-primary py-2">{['DELIVERED', 'CANCELLED', 'PAYMENT_FAILED'].includes(o.status) ? 'Details' : 'Track'} <ChevronRight size={15} /></Link>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
};

const Account = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phoneNumber: user?.phoneNumber || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.demo) return;
    api('/users/me').then((p) => {
      if (!p) return;
      setForm((f) => ({ firstName: p.firstName || f.firstName, lastName: p.lastName || f.lastName, phoneNumber: p.phoneNumber || f.phoneNumber }));
      updateProfile({ firstName: p.firstName, lastName: p.lastName, phoneNumber: p.phoneNumber });
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user?.demo) await api('/users/me', { method: 'PUT', body: form });
      updateProfile(form);
      showToast('Your details were saved', 'success');
    } catch (err) {
      showToast(err.offline ? 'Saved on this device. The server is not running.' : err.message, err.offline ? 'info' : 'error');
      if (err.offline) updateProfile(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="card max-w-xl space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">First name</span><input id="acc-first" className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
        <label><span className="label">Last name</span><input id="acc-last" className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
      </div>
      <label className="block"><span className="label">Email</span><input className="input bg-stone-50" value={user?.email || ''} disabled /></label>
      <label className="block"><span className="label">Phone number</span><input id="acc-phone" className="input" type="tel" inputMode="tel" placeholder="+91 98765 43210" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></label>
      <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
};

const TABS = [['orders', 'Orders', Receipt], ['account', 'Account details', User]];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'account' ? 'account' : 'orders';

  return (
    <div className="container-page py-8">
      <header className="flex flex-wrap items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-2xl font-extrabold text-white">
          {(user?.firstName || user?.email || '?').charAt(0).toUpperCase()}
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Your account'}</h1>
          <p className="text-ink-muted">{user?.email}</p>
        </div>
        <button className="btn-secondary text-red-600" onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /> Sign out</button>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 lg:flex-col" aria-label="Account sections">
          {TABS.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setParams({ tab: key })} className={clsx('flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold', tab === key ? 'bg-ink text-white' : 'text-ink-soft hover:bg-stone-100')}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <section>{tab === 'orders' ? <Orders /> : <Account />}</section>
      </div>
    </div>
  );
};

export default Profile;
