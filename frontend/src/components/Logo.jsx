import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Logo = ({ inverted = false, size = 'md' }) => {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  return (
    <span className="flex select-none items-center gap-2">
      <span className={`${box} grid place-items-center rounded-xl bg-brand-500 text-white shadow-sm`}>
        <UtensilsCrossed size={size === 'sm' ? 16 : 18} strokeWidth={2.5} />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-ink'}`}>
        Foodie<span className="text-brand-500">Hub</span>
      </span>
    </span>
  );
};

export default Logo;
