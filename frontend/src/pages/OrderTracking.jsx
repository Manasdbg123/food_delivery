import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Bike, Check, ChefHat, CircleX, CreditCard, MapPin, PackageCheck, Receipt, Store } from 'lucide-react';
import { CANCELLABLE, STATUSES, TERMINAL, cancelOrder, getOrder } from '../services/orders';
import { payForOrder } from '../services/payments';
import { useToast } from '../context/ToastContext';
import { EmptyState, Modal, Notice, VegMark } from '../components/ui';
import { clsx, inr, timeAgo } from '../lib/format';

const ICONS = { CREATED: Receipt, ACCEPTED: Store, PREPARING: ChefHat, OUT_FOR_DELIVERY: Bike, DELIVERED: PackageCheck };
const METHOD_LABELS = { COD: 'Cash on delivery', CARD: 'Card', UPI: 'UPI' };

const OrderTracking = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const returnedFrom = params.get('payment'); // 'success' or 'cancelled' after Stripe Checkout
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);

  const load = useCallback(() => getOrder(id).then(setOrder).catch((err) => setError(err.message)), [id]);

  useEffect(() => {
    load();
    const timer = setInterval(() => {
      setOrder((current) => {
        if (!current || !TERMINAL.has(current.status)) load();
        return current;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [load]);

  if (error && !order) {
    return <EmptyState title="We couldn't find that order" action={<Link to="/profile?tab=orders" className="btn-primary">See your orders</Link>}>{error}</EmptyState>;
  }
  if (!order) {
    return <div className="container-page max-w-3xl py-10"><div className="skeleton h-64 rounded-3xl" /></div>;
  }

  const failed = order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED';
  const currentIndex = STATUSES.findIndex((s) => s.key === order.status);
  const current = STATUSES[currentIndex];
  // A live online order stays CREATED until payment-service confirms the payment.
  const awaitingPayment = !order.demo && order.status === 'CREATED' && order.paymentMethod && order.paymentMethod !== 'COD';
  const confirming = awaitingPayment && returnedFrom === 'success';

  const doPay = async () => {
    setPaying(true);
    try {
      if (!(await payForOrder(order.id))) {
        showToast('Payment received. Confirming your order…', 'success');
        load();
        setPaying(false);
      }
    } catch (err) {
      showToast(err.message || 'Could not open the payment page', 'error');
      setPaying(false);
    }
  };

  const doCancel = async () => {
    setCancelling(true);
    try {
      setOrder({ ...order, ...(await cancelOrder(order.id)) });
      showToast('Your order was cancelled', 'info');
    } catch (err) {
      showToast(err.message || 'Could not cancel this order', 'error');
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  return (
    <div className="container-page max-w-3xl py-8">
      <Link to="/profile?tab=orders" className="text-sm font-semibold text-ink-muted hover:text-ink">← All orders</Link>

      <section className="card mt-4 overflow-hidden">
        <div className={clsx('p-6 text-white', failed ? 'bg-stone-700' : order.status === 'DELIVERED' ? 'bg-emerald-600' : 'bg-ink')}>
          <p className="eyebrow text-brand-300">{order.demo ? 'Demo order' : `Order #${order.id}`}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">
            {order.status === 'CANCELLED' && 'Order cancelled'}
            {order.status === 'PAYMENT_FAILED' && 'Payment failed'}
            {!failed && current?.label}
          </h1>
          <p className="mt-1 text-stone-200">
            {order.status === 'PAYMENT_FAILED' ? 'The payment did not go through, so you have not been charged.'
              : failed ? 'Any amount paid is refunded to the original payment method.'
                : confirming ? 'Payment received. Waiting for the bank to confirm it.'
                  : awaitingPayment ? 'Waiting for your payment. The restaurant starts cooking once it is confirmed.'
                    : current?.detail}
          </p>
          {awaitingPayment && !confirming && (
            <button className="btn-primary mt-4" onClick={doPay} disabled={paying}>
              <CreditCard size={16} /> {paying ? 'Opening payment…' : `Pay now · ${inr(order.totalAmount)}`}
            </button>
          )}
        </div>

        {!failed && (
          <ol className="grid grid-cols-5 gap-1 px-4 py-6 sm:px-6">
            {STATUSES.map((s, i) => {
              const Icon = ICONS[s.key];
              const done = i < currentIndex || order.status === 'DELIVERED';
              const active = i === currentIndex && order.status !== 'DELIVERED';
              return (
                <li key={s.key} className="relative flex flex-col items-center text-center">
                  {i > 0 && <span className={clsx('absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 rounded-full', i <= currentIndex ? 'bg-brand-500' : 'bg-stone-200')} />}
                  <span className={clsx(
                    'relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 transition',
                    done ? 'border-brand-500 bg-brand-500 text-white' : active ? 'border-brand-500 bg-white text-brand-600 ring-4 ring-brand-100' : 'border-stone-200 bg-white text-stone-400',
                  )}>
                    {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </span>
                  <span className={clsx('mt-2 text-xs font-semibold sm:text-sm', active ? 'text-ink' : 'text-ink-muted')}>{s.label}</span>
                </li>
              );
            })}
          </ol>
        )}

        {awaitingPayment && returnedFrom === 'cancelled' && (
          <div className="px-6 pb-6"><Notice tone="warn">You left the payment page before paying. Your order is saved: pay now, or cancel it below.</Notice></div>
        )}

        {order.demo && (
          <div className="px-6 pb-6"><Notice>The backend is not running, so this order lives in your browser and moves through the stages on a timer. With the backend up, status comes from order-service as payment and delivery events arrive.</Notice></div>
        )}
      </section>

      <section className="card mt-6 p-6" aria-labelledby="receipt-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="receipt-title" className="text-lg font-bold">{order.restaurantName || 'Your order'}</h2>
            <p className="text-sm text-ink-muted">Placed {timeAgo(order.createdAt)}{order.paymentMethod ? ` · ${METHOD_LABELS[order.paymentMethod] || order.paymentMethod}` : ''}</p>
          </div>
          {CANCELLABLE.has(order.status) && (
            <button className="btn-secondary text-red-600" onClick={() => setConfirmCancel(true)}><CircleX size={16} /> Cancel order</button>
          )}
        </div>

        {order.deliveryAddress && (
          <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" /> {order.deliveryAddress}</p>
        )}

        {order.items?.length > 0 && (
          <ul className="mt-5 space-y-3 border-t border-stone-200 pt-5">
            {order.items.map((item) => (
              <li key={item.menuItemId} className="flex items-center gap-3 text-sm">
                {item.isVeg !== undefined && <VegMark isVeg={item.isVeg} />}
                <span className="flex-1">{item.name} <span className="text-ink-muted">× {item.quantity}</span></span>
                <span className="tabular-nums">{inr(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 space-y-2 border-t border-stone-200 pt-5 text-sm">
          {order.subtotal != null && <div className="flex justify-between text-ink-soft"><span>Item total</span><span>{inr(order.subtotal)}</span></div>}
          {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span>− {inr(order.discount)}</span></div>}
          {order.deliveryFee != null && <div className="flex justify-between text-ink-soft"><span>Delivery fee</span><span>{order.deliveryFee ? inr(order.deliveryFee) : 'Free'}</span></div>}
          {order.gst != null && <div className="flex justify-between text-ink-soft"><span>Taxes and fees</span><span>{inr((order.gst || 0) + (order.platformFee || 0))}</span></div>}
          <div className="flex justify-between text-base font-extrabold"><span>Total</span><span>{inr(order.totalAmount)}</span></div>
        </div>
      </section>

      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel this order?"
        footer={<>
          <button className="btn-secondary flex-1" onClick={() => setConfirmCancel(false)}>Keep order</button>
          <button className="btn-primary flex-1 bg-red-600 hover:bg-red-700" onClick={doCancel} disabled={cancelling}>{cancelling ? 'Cancelling…' : 'Yes, cancel'}</button>
        </>}
      >
        The restaurant has not started cooking yet, so you can still cancel. Any amount paid is refunded.
      </Modal>
    </div>
  );
};

export default OrderTracking;
