import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Logo = ({ inverted = false, size = 28 }) => (
  <div className="flex items-center gap-2 select-none">
    <span
      className="flex items-center justify-center rounded-lg"
      style={{ width: size + 12, height: size + 12, backgroundColor: '#fc8019' }}
    >
      <UtensilsCrossed size={size * 0.6} color="#fff" strokeWidth={2.5} />
    </span>
    <span
      className="font-extrabold tracking-tight"
      style={{ fontSize: size * 0.75, color: inverted ? '#fff' : '#3d4152' }}
    >
      Foodie<span style={{ color: '#fc8019' }}>Hub</span>
    </span>
  </div>
);

export default Logo;
