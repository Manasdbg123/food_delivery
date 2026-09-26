import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Mail, MessageSquare, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { clsx } from '../lib/format';

const TOPICS = {
  Orders: [
    ['Where is my order?', 'Open Profile → Orders and pick the order. The tracking page updates by itself as the restaurant and delivery partner move it along.'],
    ['Can I cancel an order?', 'Yes, until the restaurant starts preparing it. Open the order and choose Cancel order. Any amount paid is refunded to the original payment method.'],
    ['An item was missing or wrong', 'Contact support from this page with your order number and we will refund the item.'],
  ],
  Payments: [
    ['Which payment methods can I use?', 'UPI, credit and debit cards, and cash on delivery.'],
    ['My payment failed but money was deducted', 'Failed payments are reversed by your bank automatically, usually within 5–7 working days.'],
    ['How do coupons work?', 'Apply a code at checkout or tap one on the Offers page. Only one coupon can be used per order, and each has a minimum order value.'],
  ],
  Account: [
    ['How do I change my details?', 'Go to Profile → Account details. Your name and phone number are used for delivery.'],
    ['I forgot my password', 'Contact support with the email address you signed up with and we will help you reset it.'],
  ],
  'Partner with us': [
    ['How do I list my restaurant?', 'Write to partners@foodiehub.example with your restaurant name, city and FSSAI licence number.'],
    ['How do I become a delivery partner?', 'Write to riders@foodiehub.example with your city and the vehicle you will use.'],
  ],
};

const Help = () => {
  const { showToast } = useToast();
  const [topic, setTopic] = useState('Orders');
  const [open, setOpen] = useState(0);
  const [q, setQ] = useState('');

  const faqs = q.trim()
    ? Object.values(TOPICS).flat().filter(([qq, a]) => `${qq} ${a}`.toLowerCase().includes(q.toLowerCase()))
    : TOPICS[topic];

  return (
    <div className="container-page py-8">
      <section className="rounded-3xl bg-sky-900 p-8 text-white sm:p-12">
        <p className="eyebrow text-sky-200">Help & support</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white">How can we help?</h1>
        <label className="relative mt-6 block max-w-lg">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input h-12 pl-11" placeholder="Search help articles" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search help" />
        </label>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr_280px]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Help topics">
          {Object.keys(TOPICS).map((t) => (
            <button key={t} onClick={() => { setTopic(t); setOpen(0); setQ(''); }} className={clsx('whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold', topic === t && !q ? 'bg-ink text-white' : 'text-ink-soft hover:bg-stone-100')}>
              {t}
            </button>
          ))}
        </nav>

        <section className="card divide-y divide-stone-200" aria-label="Frequently asked questions">
          {faqs.length === 0 && <p className="p-6 text-ink-muted">No articles match “{q}”. Contact us and we will answer directly.</p>}
          {faqs.map(([question, answer], i) => (
            <div key={question}>
              <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {question}
                <ChevronDown size={18} className={clsx('shrink-0 text-ink-muted transition', open === i && 'rotate-180')} />
              </button>
              {open === i && <p className="animate-fade-up px-6 pb-5 text-ink-soft">{answer}</p>}
            </div>
          ))}
        </section>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold">Still need help?</h2>
          <p className="mt-1 text-sm text-ink-muted">Our team replies within a few minutes, 7am to midnight.</p>
          <button className="btn-primary mt-4 w-full" onClick={() => showToast('Support chat is not connected in this demo. Email us instead.', 'info', 4000)}>
            <MessageSquare size={16} /> Chat with us
          </button>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft"><Mail size={15} /> <span className="select-all">support@foodiehub.example</span></p>
          <Link to="/profile?tab=orders" className="mt-4 block text-sm font-semibold text-brand-600">Go to your orders →</Link>
        </aside>
      </div>
    </div>
  );
};

export default Help;
