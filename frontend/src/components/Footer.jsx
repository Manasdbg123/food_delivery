import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { CITIES } from '../data/catalog';

const COLUMNS = [
  { title: 'Company', links: [['About FoodieHub', '/support'], ['Offers', '/offers'], ['Dineout', '/dineout']] },
  { title: 'Help', links: [['Help & support', '/support'], ['Your orders', '/profile?tab=orders'], ['Partner with us', '/support']] },
];

const Footer = () => (
  <footer className="mt-auto bg-ink text-stone-400">
    <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Logo inverted />
        <p className="mt-4 max-w-xs text-sm">Food from the restaurants you love, delivered while it is still hot.</p>
      </div>
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{col.title}</h3>
          <ul className="space-y-2.5 text-sm">
            {col.links.map(([label, to]) => (
              <li key={label}><Link to={to} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">We deliver to</h3>
        <ul className="space-y-2.5 text-sm">{CITIES.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container-page flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} FoodieHub. A portfolio project.</span>
        <span>Prices include applicable taxes at checkout.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
