import React, { createContext, useContext, useEffect, useState } from 'react';
import { CITIES } from '../data/catalog';

const LocationContext = createContext(null);
export const useLocationState = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState(() => {
    try {
      const saved = localStorage.getItem('foodiehub_city');
      return CITIES.includes(saved) ? saved : 'Bangalore';
    } catch { return 'Bangalore'; }
  });
  useEffect(() => {
    try { localStorage.setItem('foodiehub_city', city); } catch { /* ignore */ }
  }, [city]);
  return <LocationContext.Provider value={{ city, setCity, cities: CITIES }}>{children}</LocationContext.Provider>;
};
