// Sample catalogue used when the backend is not running, so the site is fully
// browsable on its own. restaurant-service and menu-service seed the same ids and
// names, so switching the backend on changes where the data comes from, not what
// the pages show.

const img = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'];

export const CUISINES = ['Biryani', 'South Indian', 'North Indian', 'Burgers', 'Pizza', 'Desserts', 'Kebabs', 'Chinese', 'Cafe'];

export const RESTAURANTS = [
  { id: 1, city: 'Bangalore', area: 'Koramangala', name: 'Meghana Foods', cuisine: 'Biryani, Andhra', rating: 4.5, ratingCount: 18200, avgDeliveryTimeMinutes: 30, costForTwo: 500, offer: '20% off up to ₹50', imageUrl: img('photo-1631515243349-e0cb75fb8d3a') },
  { id: 2, city: 'Bangalore', area: 'Indiranagar', name: 'Truffles', cuisine: 'Burgers, American, Desserts', rating: 4.4, ratingCount: 24100, avgDeliveryTimeMinutes: 35, costForTwo: 450, offer: 'Free delivery', imageUrl: img('photo-1568901346375-23c9450c58cd') },
  { id: 3, city: 'Bangalore', area: 'Jayanagar', name: 'Rameshwaram Cafe', cuisine: 'South Indian, Pure Veg', rating: 4.6, ratingCount: 31500, avgDeliveryTimeMinutes: 25, costForTwo: 250, veg: true, imageUrl: img('photo-1589301760014-d929f39ce9b1') },
  { id: 4, city: 'Mumbai', area: 'Colaba', name: 'Leopold Cafe', cuisine: 'Continental, Cafe, Desserts', rating: 4.3, ratingCount: 9800, avgDeliveryTimeMinutes: 25, costForTwo: 900, imageUrl: img('photo-1555396273-367ea4eb4db5') },
  { id: 5, city: 'Mumbai', area: 'Colaba', name: 'Bademiya', cuisine: 'Kebabs, Mughlai', rating: 4.2, ratingCount: 14300, avgDeliveryTimeMinutes: 45, costForTwo: 600, offer: '₹75 off above ₹399', imageUrl: img('photo-1604908176997-125f25cc6f3d') },
  { id: 6, city: 'Mumbai', area: 'Fort', name: 'Britannia & Co.', cuisine: 'Parsi, Biryani', rating: 4.5, ratingCount: 7600, avgDeliveryTimeMinutes: 30, costForTwo: 800, imageUrl: img('photo-1563379091339-03b21ab4a4f8') },
  { id: 7, city: 'Delhi', area: 'Chandni Chowk', name: "Karim's", cuisine: 'Mughlai, North Indian, Kebabs', rating: 4.7, ratingCount: 27400, avgDeliveryTimeMinutes: 40, costForTwo: 700, offer: '15% off up to ₹90', imageUrl: img('photo-1610970881699-44a5587cbd0f') },
  { id: 8, city: 'Delhi', area: 'Chanakyapuri', name: 'Bukhara', cuisine: 'North Indian, Kebabs', rating: 4.8, ratingCount: 5200, avgDeliveryTimeMinutes: 50, costForTwo: 3000, imageUrl: img('photo-1606755962773-d324e0a13086') },
  { id: 9, city: 'Delhi', area: 'Khan Market', name: 'Big Chill', cuisine: 'Italian, Pizza, Desserts', rating: 4.6, ratingCount: 16900, avgDeliveryTimeMinutes: 35, costForTwo: 1200, offer: 'Free dessert above ₹799', imageUrl: img('photo-1513104890138-7c749659a591') },
  { id: 10, city: 'Hyderabad', area: 'Secunderabad', name: 'Paradise Biryani', cuisine: 'Biryani, Hyderabadi', rating: 4.1, ratingCount: 42800, avgDeliveryTimeMinutes: 30, costForTwo: 600, offer: '20% off up to ₹100', imageUrl: img('photo-1633945274405-b6c8069047b0') },
  { id: 11, city: 'Hyderabad', area: 'RTC X Roads', name: 'Bawarchi', cuisine: 'Biryani, North Indian', rating: 4.3, ratingCount: 21000, avgDeliveryTimeMinutes: 35, costForTwo: 500, imageUrl: img('photo-1563379926898-05f4575a45d8') },
  { id: 12, city: 'Hyderabad', area: 'Himayatnagar', name: 'Cafe Bahar', cuisine: 'Biryani, Desserts', rating: 4.4, ratingCount: 11800, avgDeliveryTimeMinutes: 25, costForTwo: 450, imageUrl: img('photo-1589301760014-d929f39ce9b1') },
  { id: 13, city: 'Chennai', area: 'Besant Nagar', name: 'Murugan Idli Shop', cuisine: 'South Indian, Pure Veg', rating: 4.5, ratingCount: 19300, avgDeliveryTimeMinutes: 20, costForTwo: 200, veg: true, imageUrl: img('photo-1610192244261-3f33de3f55e4') },
  { id: 14, city: 'Chennai', area: 'T. Nagar', name: 'Anjappar', cuisine: 'Chettinad, Biryani', rating: 4.2, ratingCount: 8700, avgDeliveryTimeMinutes: 40, costForTwo: 550, offer: '₹50 off above ₹299', imageUrl: img('photo-1631515243349-e0cb75fb8d3a') },
  { id: 15, city: 'Chennai', area: 'Mylapore', name: 'Saravana Bhavan', cuisine: 'South Indian, Pure Veg', rating: 4.4, ratingCount: 26100, avgDeliveryTimeMinutes: 25, costForTwo: 350, veg: true, imageUrl: img('photo-1563379091339-03b21ab4a4f8') },
];

// Menus by kitchen style: [name, description, price, isVeg, category, bestseller]
const MENUS = {
  biryani: [
    ['Chicken Dum Biryani', 'Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions', 340, false, 'Biryani', true],
    ['Mutton Biryani', 'Tender goat on the bone, layered and sealed in dum', 420, false, 'Biryani', true],
    ['Paneer Tikka Biryani', 'Char-grilled paneer folded into fragrant rice', 290, true, 'Biryani'],
    ['Egg Biryani', 'Two boiled eggs in spiced masala rice', 260, false, 'Biryani'],
    ['Chicken 65', 'Crisp, curry-leaf tempered fried chicken', 280, false, 'Starters', true],
    ['Gobi Manchurian', 'Cauliflower florets tossed in a tangy Indo-Chinese sauce', 210, true, 'Starters'],
    ['Mirchi Ka Salan', 'Green chillies in a peanut and sesame gravy', 140, true, 'Sides'],
    ['Raita', 'Cool yoghurt with cucumber and roasted cumin', 60, true, 'Sides'],
    ['Double Ka Meetha', 'Bread pudding soaked in saffron milk, topped with nuts', 130, true, 'Desserts'],
  ],
  south: [
    ['Ghee Podi Roast Dosa', 'Crisp dosa brushed with ghee and gunpowder spice', 140, true, 'Dosa', true],
    ['Masala Dosa', 'Golden dosa with potato palya, sambar and chutneys', 120, true, 'Dosa', true],
    ['Thatte Idli', 'Plate-sized soft idli with coconut chutney', 70, true, 'Idli & Vada', true],
    ['Medu Vada', 'Crisp lentil fritters, two pieces, with sambar', 80, true, 'Idli & Vada'],
    ['Pongal', 'Rice and moong dal cooked with black pepper and ghee', 110, true, 'Meals'],
    ['Mini Meals', 'Rice, sambar, rasam, poriyal, curd and papad', 180, true, 'Meals'],
    ['Kesari Bath', 'Semolina halwa with saffron and cashews', 70, true, 'Sweets'],
    ['Filter Coffee', 'Strong decoction with frothed milk', 50, true, 'Beverages', true],
  ],
  north: [
    ['Butter Chicken', 'Tandoori chicken in a silky tomato and butter gravy', 380, false, 'Mains', true],
    ['Mutton Rogan Josh', 'Slow-braised mutton in Kashmiri chilli gravy', 460, false, 'Mains'],
    ['Dal Makhani', 'Black lentils simmered overnight with butter and cream', 280, true, 'Mains', true],
    ['Paneer Butter Masala', 'Cottage cheese in a rich tomato-cashew gravy', 320, true, 'Mains'],
    ['Seekh Kebab', 'Minced lamb skewers from the tandoor, four pieces', 360, false, 'Kebabs', true],
    ['Tandoori Chicken (Half)', 'Yoghurt and spice marinated, charred in the tandoor', 340, false, 'Kebabs'],
    ['Garlic Naan', 'Tandoor-baked bread with garlic and butter', 70, true, 'Breads'],
    ['Laccha Paratha', 'Flaky layered whole-wheat bread', 60, true, 'Breads'],
    ['Phirni', 'Chilled rice pudding with cardamom and pistachio', 120, true, 'Desserts'],
  ],
  burgers: [
    ['Classic Cheese Burger', 'Grilled patty, cheddar, pickles and house sauce', 260, false, 'Burgers', true],
    ['Crispy Chicken Burger', 'Buttermilk fried chicken with slaw', 280, false, 'Burgers', true],
    ['Crispy Veg Burger', 'Crumbed vegetable patty with lettuce and mayo', 190, true, 'Burgers'],
    ['Peri Peri Fries', 'Skin-on fries dusted with peri peri', 150, true, 'Sides', true],
    ['Loaded Nachos', 'Nachos with cheese sauce, salsa and jalapeños', 220, true, 'Sides'],
    ['Chocolate Brownie Shake', 'Thick shake blended with a fudge brownie', 210, true, 'Shakes'],
    ['Blueberry Cheesecake', 'Baked cheesecake with blueberry compote', 240, true, 'Desserts'],
  ],
  cafe: [
    ['Chicken Club Sandwich', 'Triple-decker with egg, chicken and fries', 360, false, 'Mains', true],
    ['Fish and Chips', 'Beer-battered basa with tartare sauce', 520, false, 'Mains'],
    ['Penne Arrabbiata', 'Penne in a spicy tomato and garlic sauce', 380, true, 'Pasta'],
    ['Margherita Pizza', 'San Marzano tomato, mozzarella and basil', 420, true, 'Pizza', true],
    ['Pepperoni Pizza', 'Loaded with spicy pepperoni and mozzarella', 520, false, 'Pizza'],
    ['Sizzling Brownie', 'Warm brownie with vanilla ice cream on a hot plate', 280, true, 'Desserts', true],
    ['Cold Coffee', 'Blended iced coffee with a scoop of ice cream', 190, true, 'Beverages'],
  ],
};

const STYLE_FOR = {
  1: 'biryani', 2: 'burgers', 3: 'south', 4: 'cafe', 5: 'north', 6: 'biryani', 7: 'north', 8: 'north',
  9: 'cafe', 10: 'biryani', 11: 'biryani', 12: 'biryani', 13: 'south', 14: 'biryani', 15: 'south',
};

export function menuFor(restaurantId) {
  const restaurant = RESTAURANTS.find((r) => r.id === Number(restaurantId));
  const style = STYLE_FOR[restaurantId] || 'north';
  return MENUS[style]
    .filter(([, , , isVeg]) => !restaurant?.veg || isVeg)
    .map(([name, description, price, isVeg, category, bestseller], i) => ({
      id: Number(restaurantId) * 100 + i + 1,
      restaurantId: Number(restaurantId),
      name, description, price, isVeg, category, bestseller: Boolean(bestseller),
    }));
}

export const DINEOUT = [
  { id: 1, name: 'The Bier Library', area: 'Koramangala, Bangalore', cuisine: 'Brewery, Continental', costForTwo: 1800, rating: 4.4, offer: 'Flat 15% off on walk-in', imageUrl: img('photo-1514933651103-005eec06c04b') },
  { id: 2, name: 'Windmills Craftworks', area: 'Whitefield, Bangalore', cuisine: 'Brewery, Jazz, Modern', costForTwo: 2200, rating: 4.5, offer: '10% off on the food bill', imageUrl: img('photo-1550966871-3ed3cdb5ed0c') },
  { id: 3, name: 'Toit Brewpub', area: 'Indiranagar, Bangalore', cuisine: 'Brewery, Pub food', costForTwo: 2000, rating: 4.6, offer: 'Complimentary dessert', imageUrl: img('photo-1574096079513-d8259312b785') },
];
