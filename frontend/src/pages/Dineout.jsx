import React, { useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { DINEOUT } from '../data/catalog';
import { Modal, Rating, SmartImage } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { inr } from '../lib/format';

const SLOTS = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
const today = () => new Date().toISOString().slice(0, 10);

const Dineout = () => {
  const { showToast } = useToast();
  const [venue, setVenue] = useState(null);
  const [booking, setBooking] = useState({ date: today(), slot: SLOTS[2], guests: 2 });

  const confirm = () => {
    showToast(`Table for ${booking.guests} at ${venue.name} requested for ${booking.slot}`, 'success', 4000);
    setVenue(null);
  };

  return (
    <div className="container-page py-8">
      <section className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-12">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(700px 300px at 90% 0%, #fc5a12, transparent 60%)' }} />
        <div className="relative">
          <p className="eyebrow text-brand-300">Dineout</p>
          <h1 className="mt-2 max-w-xl text-4xl font-extrabold text-white">Book a table at the best places in town</h1>
          <p className="mt-3 max-w-lg text-stone-300">Reserve ahead, skip the wait, and get an offer on the bill.</p>
        </div>
      </section>

      <h2 className="mt-10 text-2xl font-extrabold">Trending dining spots</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DINEOUT.map((v) => (
          <article key={v.id} className="card overflow-hidden">
            <SmartImage src={v.imageUrl} alt={v.name} className="aspect-[16/10] w-full" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{v.name}</h3>
                <Rating value={v.rating} />
              </div>
              <p className="text-sm text-ink-muted">{v.cuisine} · {inr(v.costForTwo)} for two</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted"><MapPin size={14} /> {v.area}</p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">{v.offer}</p>
              <button className="btn-primary mt-4 w-full" onClick={() => setVenue(v)}>Book a table</button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(venue)} onClose={() => setVenue(null)} title={venue ? `Book at ${venue.name}` : ''}
        footer={<><button className="btn-secondary flex-1" onClick={() => setVenue(null)}>Cancel</button><button className="btn-primary flex-1" onClick={confirm}>Request booking</button></>}
      >
        <div className="grid gap-4">
          <label><span className="label flex items-center gap-1.5"><CalendarDays size={14} /> Date</span>
            <input type="date" className="input" min={today()} value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} />
          </label>
          <div>
            <span className="label">Time</span>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((s) => (
                <button key={s} type="button" onClick={() => setBooking({ ...booking, slot: s })} className={`chip justify-center ${booking.slot === s ? 'chip-active' : ''}`}>{s}</button>
              ))}
            </div>
          </div>
          <label><span className="label flex items-center gap-1.5"><Users size={14} /> Guests</span>
            <select className="input" value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })}>
              {Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i ? 'guests' : 'guest'}</option>)}
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default Dineout;
