import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();
export const useLocationState = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState('Bangalore');
  return (
    <LocationContext.Provider value={{ city, setCity }}>
      {children}
    </LocationContext.Provider>
  );
};
