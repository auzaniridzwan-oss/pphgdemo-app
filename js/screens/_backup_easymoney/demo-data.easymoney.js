/**
 * Demo data objects — all UI content is driven from these arrays.
 * No static product/category markup exists in the HTML.
 * @module DemoData
 */

/** Test user profile for Braze changeUser() */
export const TEST_USER = {
  external_id: 'emth_1',
  first_name: 'Auzani',
  last_name: 'Ridzwan',
  email: 'auzani.ridzwan+emth01@braze.com',
  phone: '+6588414911',
  country: 'TH',
};

/** Promo banners for the carousel (16:7 aspect) */
export const BANNERS = [
  {
    id: 'banner_1',
    title: 'Flash Sale — Up to 70% Off',
    subtitle: 'Limited time collectibles deal',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=350&fit=crop',
    cta: 'Shop Now',
    bg: '#C62828',
  },
  {
    id: 'banner_2',
    title: 'New Arrivals This Week',
    subtitle: 'Fresh drops from top sellers',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=350&fit=crop',
    cta: 'Explore',
    bg: '#1565C0',
  },
  {
    id: 'banner_3',
    title: 'Refer & Earn RM50',
    subtitle: 'Share with friends and earn credit',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=350&fit=crop',
    cta: 'Learn More',
    bg: '#2E7D32',
  },
];

/** 5 categories for the grid */
export const CATEGORIES = [
  { id: 'jewelry', label: 'Jewelry', icon: 'fa-solid fa-gem', color: '#1976D2' },
  { id: 'watches', label: 'Watches', icon: 'fa-solid fa-clock', color: '#E91E63' },
  { id: 'electronics', label: 'Electronics', icon: 'fa-solid fa-microchip', color: '#9C27B0' },
  { id: 'bags', label: 'Bags', icon: 'fa-solid fa-bag-shopping', color: '#FF9800' },
  { id: 'gold', label: 'Gold', icon: 'fa-solid fa-coins', color: '#4CAF50' },
];

/** 20 demo products */
export const PRODUCTS = [

  {
    "id": "1",
    "title": "Diamond Solitaire Ring",
    "price": 118750,
    "originalPrice": 125000,
    "discount": 0.05,
    "grade": "S",
    "status": "rare",
    "category": "jewelry",
    "thumbnail": "https://images.unsplash.com/photo-1666210508877-10798b0622b2?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1666210508877-10798b0622b2?w=400&h=400&fit=crop"
    ],
    "description": "1.5 carat round-cut diamond in platinum. Exceptional brilliance."
  },
  {
    "id": "10",
    "title": "Gold Charm Bracelet",
    "price": 2520,
    "originalPrice": 28000,
    "discount": 0.1,
    "grade": "B",
    "status": "rare",
    "category": "jewelry",
    "thumbnail": "https://images.unsplash.com/photo-1766560359672-37fc877671a3?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1766560359672-37fc877671a3?w=400&h=400&fit=crop"
    ],
    "description": "18k gold chain with three vintage charms included."
  },
  {
    "id": "11",
    "title": "Opal Ring",
    "price": 14140,
    "originalPrice": 15500,
    "discount": 0.08,
    "grade": "A",
    "status": "rare",
    "category": "jewelry",
    "thumbnail": "https://images.unsplash.com/photo-1657869208653-5a0df262b186?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1657869208653-5a0df262b186?w=400&h=400&fit=crop"
    ],
    "description": "Natural fire opal with iridescent flashes of red and green."
  },
  {
    "id": "12",
    "title": "Antique Cameo",
    "price": 18900,
    "originalPrice": 21000,
    "discount": 0.1,
    "grade": "B",
    "status": "rare",
    "category": "jewelry",
    "thumbnail": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop"
    ],
    "description": "Natural fire opal with iridescent flashes of red and green."
  },
  {
    "id": "21",
    "title": "Rolex Datejust 36",
    "price": 270750,
    "originalPrice": 285000,
    "discount": 0.05,
    "grade": "S",
    "status": "rare",
    "category": "watches",
    "thumbnail": "https://images.unsplash.com/photo-1649357584808-333476473dce?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1649357584808-333476473dce?w=400&h=400&fit=crop"
    ],
    "description": "Classic steel and gold jubilee bracelet. Champagne dial."
  },
  {
    "id": "23",
    "title": "Casio G-Shock Rugged",
    "price": 960,
    "originalPrice": 3200,
    "discount": 0.7,
    "grade": "D",
    "status": "hot",
    "category": "watches",
    "thumbnail": "https://images.unsplash.com/photo-1703672997520-7b9b17876aaa?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1703672997520-7b9b17876aaa?w=400&h=400&fit=crop"
    ],
    "description": "Shock resistant black resin digital watch. Ideal for outdoor activities."
  },
  {
    "id": "22",
    "title": "Omega Speedmaster",
    "price": 148500,
    "originalPrice": 165000,
    "discount": 0.12,
    "grade": "A",
    "status": "new",
    "category": "watches",
    "thumbnail": "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop"
    ],
    "description": "The famous 'Moonwatch' with manual wind movement. Minor bezel wear."
  },
  {
    "id": "24",
    "title": "Seiko SKX007 Diver",
    "price": 12600,
    "originalPrice": 14000,
    "discount": 0.1,
    "grade": "B",
    "status": "rare",
    "category": "watches",
    "thumbnail": "https://images.unsplash.com/photo-1611353229593-16439c293495?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1611353229593-16439c293495?w=400&h=400&fit=crop"
    ],
    "description": "Iconic automatic diver watch with a rubber strap. Reliable movement"
  },
  {
    "id": "41",
    "title": "MacBook Pro M2 14\"",
    "price": 40800,
    "originalPrice": 48000,
    "discount": 0.15,
    "grade": "A",
    "status": "new",
    "category": "electronics",
    "thumbnail": "	https://images.unsplash.com/photo-1713557670055-7df8d5502a51?w=400&h=400&fit=crop",
    "images": [
      "	https://images.unsplash.com/photo-1713557670055-7df8d5502a51?w=400&h=400&fit=crop"
    ],
    "description": "512GB SSD Space Gray. Like new condition with original box."
  },
  {
    "id": "42",
    "title": "iPhone 13 Mini 128GB",
    "price": 4600,
    "originalPrice": 11500,
    "discount": 0.6,
    "grade": "D",
    "status": "hot",
    "category": "electronics",
    "thumbnail": "https://images.unsplash.com/photo-1604548530945-fbdce3e76bc4?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1604548530945-fbdce3e76bc4?w=400&h=400&fit=crop"
    ],
    "description": "Blue finish significant screen scratches but fully functional."
  },
  {
    "id": "45",
    "title": "iPad Air 4th Gen",
    "price": 7500,
    "originalPrice": 12500,
    "discount": 0.45,
    "grade": "C",
    "status": "hot",
    "category": "electronics",
    "thumbnail": "https://images.unsplash.com/photo-1603972924044-1fa96d503676?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1603972924044-1fa96d503676?w=400&h=400&fit=crop"
    ],
    "description": "64GB Sky Blue. Touch ID works perfectly. Minor dent."
  },
  {
    "id": "49",
    "title": "Samsung Galaxy S23",
    "price": 12950,
    "originalPrice": 18500,
    "discount": 0.3,
    "grade": "B",
    "status": "new",
    "category": "electronics",
    "thumbnail": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop"
    ],
    "description": "64GB Sky Blue. Touch ID works perfectly. Minor dent."
  },
  {
    "id": "61",
    "title": "Hermes Birkin 30",
    "price": 427500,
    "originalPrice": 450000,
    "discount": 0.05,
    "grade": "S",
    "status": "rare",
    "category": "bags",
    "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
    ],
    "description": "Togo leather in Gold with Palladium hardware. Collector's item."
  },
  {
    "id": "62",
    "title": "Prada Nylon Backpack",
    "price": 6750,
    "originalPrice": 15000,
    "discount": 0.55,
    "grade": "C",
    "status": "hot",
    "category": "bags",
    "thumbnail": "https://images.unsplash.com/photo-1668435734515-2396649c7cb4?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1668435734515-2396649c7cb4?w=400&h=400&fit=crop"
    ],
    "description": "Classic black nylon with signature triangle logo. Very durable."
  },
  {
    "id": "63",
    "title": "Gucci Marmont Small",
    "price": 25600,
    "originalPrice": 32000,
    "discount": 0.2,
    "grade": "B",
    "status": "new",
    "category": "bags",
    "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"
    ],
    "description": "Matelass\'e9 chevron leather with GG logo. Slight corner wear."
  },
  {
    "id": "64",
    "title": "Louis Vuitton Keepall",
    "price": 37800,
    "originalPrice": 42000,
    "discount": 0.1,
    "grade": "B",
    "status": "rare",
    "category": "bags",
    "thumbnail": "https://images.unsplash.com/photo-1758633854740-26967a7d18f9?w=400&h=400&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1758633854740-26967a7d18f9?w=400&h=400&fit=crop"
    ],
    "description": "Monogram canvas 55cm travel bag. Handles show patina."
  },


];

/** Demo coupons */
export const COUPONS = [
  {
    id: 'coupon_1',
    code: 'WELCOME20',
    description: '20% off your first purchase',
    discountType: 'percent',
    discountValue: 20,
    minSpend: 50,
  },
  {
    id: 'coupon_2',
    code: 'SAVE30',
    description: 'RM30 off orders above RM200',
    discountType: 'fixed',
    discountValue: 30,
    minSpend: 200,
  },
  {
    id: 'coupon_3',
    code: 'COLLECTOR10',
    description: '10% off collectible items',
    discountType: 'percent',
    discountValue: 10,
    minSpend: 0,
  },
];

/** Filter tab labels for the HomeFeed */
export const FILTER_TABS = ['Hot Deals', 'New Arrivals', 'Rare Items'];

/** Filter chip labels for SearchAndFilter */
export const FILTER_CHIPS = ['All', 'Jewelry', 'Watches', 'Electronics', 'Bags', 'Gold'];

/**
 * Format price with currency prefix.
 * @param {number} amount
 * @returns {string} Formatted price string.
 */
export function formatPrice(amount) {
  return `THB ${amount.toFixed(0)}`;
}
