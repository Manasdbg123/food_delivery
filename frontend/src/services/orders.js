// Orders go to order-service. When the backend is not running, checkout still works
// in a clearly labelled demo mode: the order is kept in this browser and moves
// through the same statuses on a timer, so the whole flow can be tried end to end.
import { api } from '../lib/api';

const DEMO_KEY = 'foodiehub_demo_orders';

export const STATUSES = [
  { key: 'CREATED', label: 'Order placed', detail: 'Confirming payment with your bank' },
  { key: 'ACCEPTED', label: 'Confirmed', detail: 'The restaurant has accepted your order' },
  { key: 'PREPARING', label: 'Preparing', detail: 'Your food is being cooked' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the way', detail: 'Your delivery partner has picked up the order' },
  { key: 'DELIVERED', label: 'Delivered', detail: 'Enjoy your meal' },
];
export const TERMINAL = new Set(['DELIVERED', 'CANCELLED', 'PAYMENT_FAILED']);
export const CANCELLABLE = new Set(['CREATED', 'ACCEPTED']);

// Seconds after placing at which a demo order reaches each status.
const DEMO_SCHEDULE = [['CREATED', 0], ['ACCEPTED', 6], ['PREPARING', 18], ['OUT_FOR_DELIVERY', 45], ['DELIVERED', 90]];

const readDemo = () => {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || []; } catch { return []; }
};
const writeDemo = (orders) => {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(orders.slice(0, 30))); } catch { /* storage full or blocked */ }
};

const demoStatus = (order) => {
  if (order.status === 'CANCELLED') return order;
  const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  const status = DEMO_SCHEDULE.filter(([, at]) => elapsed >= at).pop()[0];
  return { ...order, status };
};

export async function placeOrder({ restaurant, items, address, paymentMethod, couponCode, bill }) {
  const body = {
    restaurantId: restaurant.id,
    items: items.map((i) => ({ menuItemId: i.id, quantity: i.qty })),
    deliveryAddress: address,
    paymentMethod,
    couponCode: couponCode || null,
  };
  try {
    const order = await api('/orders', { method: 'POST', body });
    return { ...order, restaurantName: restaurant.name, demo: false };
  } catch (err) {
    if (!err.offline) throw err;
    const order = {
      id: `demo-${Date.now().toString(36)}`,
      demo: true,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: items.map((i) => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.qty, isVeg: i.isVeg })),
      deliveryAddress: address,
      paymentMethod,
      couponCode: bill.coupon?.code || null,
      subtotal: bill.subtotal, discount: bill.discount, deliveryFee: bill.deliveryFee,
      platformFee: bill.platformFee, gst: bill.gst, totalAmount: bill.total,
    };
    writeDemo([order, ...readDemo()]);
    return order;
  }
}

export async function getOrder(id) {
  if (String(id).startsWith('demo-')) {
    const order = readDemo().find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return demoStatus(order);
  }
  return { ...(await api(`/orders/${id}`)), demo: false };
}

export async function listOrders() {
  const demo = readDemo().map(demoStatus);
  let liveOrders = [];
  let live = false;
  try {
    liveOrders = (await api('/orders/me')).map((o) => ({ ...o, demo: false }));
    live = true;
  } catch { /* backend offline: show demo orders only */ }
  const all = [...liveOrders, ...demo].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return { orders: all, live };
}

export async function cancelOrder(id) {
  if (String(id).startsWith('demo-')) {
    const orders = readDemo();
    const current = orders.find((o) => o.id === id);
    if (!current || !CANCELLABLE.has(demoStatus(current).status)) {
      throw new Error('This order can no longer be cancelled.');
    }
    writeDemo(orders.map((o) => (o.id === id ? { ...o, status: 'CANCELLED' } : o)));
    return demoStatus({ ...current, status: 'CANCELLED' });
  }
  return api(`/orders/${id}/cancel`, { method: 'POST' });
}
