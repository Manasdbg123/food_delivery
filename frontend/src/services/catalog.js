// Restaurants and menus: live from the API when it answers, otherwise the bundled
// sample catalogue. Every result says which, so pages can be honest about it.
import { api } from '../lib/api';
import { RESTAURANTS, menuFor } from '../data/catalog';

const sample = (data) => ({ data, live: false });
const live = (data) => ({ data, live: true });

// Fields the API does not store yet fall back to the catalogue entry with the same id.
const enrich = (r) => ({ ...(RESTAURANTS.find((s) => s.id === r.id) || {}), ...r });

export async function getRestaurants(city, { signal } = {}) {
  try {
    const data = await api(`/restaurants?city=${encodeURIComponent(city)}`, { signal, auth: false });
    if (Array.isArray(data) && data.length) return live(data.map(enrich));
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }
  return sample(RESTAURANTS.filter((r) => r.city === city));
}

export async function getRestaurant(id, { signal } = {}) {
  try {
    return live(enrich(await api(`/restaurants/${id}`, { signal, auth: false })));
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    const found = RESTAURANTS.find((r) => r.id === Number(id));
    return sample(found || null);
  }
}

export async function getMenu(restaurantId, { signal } = {}) {
  try {
    const data = await api(`/menus/restaurant/${restaurantId}`, { signal, auth: false });
    if (Array.isArray(data) && data.length) {
      const extras = Object.fromEntries(menuFor(restaurantId).map((m) => [m.name, m]));
      return live(data.map((m) => ({
        category: extras[m.name]?.category || 'Menu',
        bestseller: extras[m.name]?.bestseller || false,
        ...m,
      })));
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }
  return sample(menuFor(restaurantId));
}

const matches = (text, q) => (text || '').toLowerCase().includes(q);

export async function search(query, city, { signal } = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return { restaurants: [], dishes: [], live: false };
  const { data: restaurants, live: isLive } = await getRestaurants(city, { signal });

  const restaurantHits = restaurants.filter((r) => matches(r.name, q) || matches(r.cuisine, q) || matches(r.area, q));
  const dishHits = [];
  for (const r of restaurants) {
    for (const item of menuFor(r.id)) {
      if (matches(item.name, q) || matches(item.category, q)) dishHits.push({ ...item, restaurant: r });
    }
  }
  return { restaurants: restaurantHits, dishes: dishHits.slice(0, 24), live: isLive };
}
