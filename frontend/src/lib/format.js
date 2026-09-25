const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const inr = (value) => rupee.format(Math.round(Number(value) || 0));

export const timeAgo = (iso) => {
  if (!iso) return '';
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const clsx = (...parts) => parts.filter(Boolean).join(' ');
