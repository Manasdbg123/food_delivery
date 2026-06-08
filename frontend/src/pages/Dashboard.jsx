import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Simulating fetching from Restaurant-Service
    setRestaurants([
      { id: 1, name: 'Spicy Symphony', cuisine: 'Indian', rating: 4.8, time: '25-30 min' },
      { id: 2, name: 'Burger Joint', cuisine: 'American', rating: 4.5, time: '15-20 min' },
      { id: 3, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.9, time: '40-45 min' }
    ]);
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nearby Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map(rest => (
          <div key={rest.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{rest.name}</h3>
                <p className="text-sm text-gray-500">{rest.cuisine}</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">⭐ {rest.rating}</span>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-500">🕒 {rest.time}</span>
              <button className="text-orange-600 font-bold hover:text-orange-800">View Menu &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
