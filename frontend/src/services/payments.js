// Online payments go through payment-service. With Stripe configured it answers with a
// hosted checkout page to send the customer to; in simulated mode there is no page and
// the order is confirmed on its own a moment later.
import { api } from '../lib/api';

export async function startCheckout(orderId) {
  return api('/payments/checkout', { method: 'POST', body: { orderId } });
}

// Leaves the app for Stripe Checkout. Returns false when there is nothing to visit.
export async function payForOrder(orderId) {
  const { checkoutUrl } = await startCheckout(orderId);
  if (!checkoutUrl) return false;
  window.location.assign(checkoutUrl);
  return true;
}
