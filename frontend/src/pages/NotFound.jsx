import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '../components/ui';

const NotFound = () => (
  <EmptyState icon={<UtensilsCrossed size={28} />} title="This page is off the menu" action={<Link to="/" className="btn-primary">Back to restaurants</Link>}>
    The link may be broken, or the page may have moved.
  </EmptyState>
);

export default NotFound;
