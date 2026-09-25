// Bill rules shared by the cart and checkout. order-service applies the same rules
// server-side (OrderPricing.java) and its numbers are the ones charged.

export const DELIVERY_FEE = 40;
export const PLATFORM_FEE = 6;
export const GST_RATE = 0.05;
export const FREE_DELIVERY_ABOVE = 499;

export const COUPONS = [
  { code: 'WELCOME50', title: '50% off your first order', detail: 'Up to ₹100 off on orders above ₹199', minOrder: 199, percent: 50, maxDiscount: 100 },
  { code: 'FLAT100', title: '₹100 off', detail: 'On orders above ₹599', minOrder: 599, flat: 100 },
  { code: 'FREEDEL', title: 'Free delivery', detail: 'On any order above ₹149', minOrder: 149, freeDelivery: true },
];

export const findCoupon = (code) => COUPONS.find((c) => c.code === (code || '').trim().toUpperCase());

export function couponProblem(coupon, subtotal) {
  if (!coupon) return 'That code is not valid.';
  if (subtotal < coupon.minOrder) return `Add items worth ₹${coupon.minOrder - subtotal} more to use ${coupon.code}.`;
  return null;
}

export function priceBill(subtotal, coupon) {
  const usable = coupon && !couponProblem(coupon, subtotal) ? coupon : null;
  let discount = 0;
  if (usable?.percent) discount = Math.min(Math.round(subtotal * usable.percent / 100), usable.maxDiscount ?? Infinity);
  if (usable?.flat) discount = usable.flat;
  const deliveryFee = subtotal === 0 || usable?.freeDelivery || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const platformFee = subtotal === 0 ? 0 : PLATFORM_FEE;
  const gst = Math.round((subtotal - discount) * GST_RATE);
  const total = Math.max(0, subtotal - discount + deliveryFee + platformFee + gst);
  return { subtotal, discount, deliveryFee, platformFee, gst, total, coupon: usable };
}
