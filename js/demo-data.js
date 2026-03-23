/**
 * Pan Pacific Hotel Group demo data — Singapore properties & seasonal offers (Q1 2026).
 * All list/detail UI is built from these objects at runtime.
 * @module DemoData
 */

/** Test user profile for Braze changeUser() */
export const TEST_USER = {
  external_id: 'pphg_demo_sg_01',
  first_name: 'Alex',
  last_name: 'Tan',
  email: 'alex.tan+demo@panpacific.demo',
  phone: '+6591234567',
  country: 'SG',
};

/** Hero for Book home — Marina Bay skyline */
export const BOOK_HERO = {
  image:
    'https://images.unsplash.com/photo-1525625293400-d1ab58a37616?w=900&h=1200&fit=crop',
  kicker: 'Singapore',
  title: 'Stay in the heart of the city',
};

/**
 * Singapore hotels (demo — inspired by real Pan Pacific / PARKROYAL locations).
 * @type {Array<Object>}
 */
export const HOTELS = [
  {
    id: 'pan-pacific-singapore',
    name: 'Pan Pacific Singapore',
    area: 'Marina Bay — 7 Raffles Blvd',
    description:
      'Connected to Marina Square and steps from the convention district. Outdoor pool, Pacific Club lounge, and direct MRT access via City Hall.',
    thumbnail:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    ],
    fromPrice: 420,
    phone: '+65 6336 8111',
    mapsUrl: 'https://maps.google.com/?q=Pan+Pacific+Singapore',
  },
  {
    id: 'parkroyal-marina-bay',
    name: 'PARKROYAL COLLECTION Marina Bay',
    area: 'Marina Bay — garden-in-a-hotel',
    description:
      'Biophilic design with 13m green terraces, indoor garden, and floor-to-ceiling city views. Ideal for design-forward stays during the March school holidays.',
    thumbnail:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e54c32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596436889106-35b1c3c2e5a5?w=800&h=600&fit=crop',
    ],
    fromPrice: 398,
    phone: '+65 6845 1000',
    mapsUrl: 'https://maps.google.com/?q=PARKROYAL+COLLECTION+Marina+Bay',
  },
  {
    id: 'parkroyal-beach-road',
    name: 'PARKROYAL on Beach Road',
    area: 'Kampong Glam — cultural district',
    description:
      'Rooftop pool with skyline views, short walk to Haji Lane and Arab Street. Strong choice for long weekends before the Formula 1 season kicks off.',
    thumbnail:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    fromPrice: 285,
    phone: '+65 6505 5666',
    mapsUrl: 'https://maps.google.com/?q=PARKROYAL+on+Beach+Road',
  },
  {
    id: 'serviced-suites-orchard',
    name: 'Pan Pacific Serviced Suites Orchard',
    area: 'Orchard Road',
    description:
      'Residential-style suites with kitchenette — perfect for 5-night March school-holiday family blocks or pre–Good Friday extended stays.',
    thumbnail:
      'https://images.unsplash.com/photo-1631049307264-e0dd4e8a2c38?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1631049307264-e0dd4e8a2c38?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e3decfabf2?w=800&h=600&fit=crop',
    ],
    fromPrice: 310,
    phone: '+65 6737 8333',
    mapsUrl: 'https://maps.google.com/?q=Pan+Pacific+Serviced+Suites+Orchard',
  },
];

/**
 * Room types per hotel id.
 * @type {Object.<string, Array<Object>>}
 */
export const ROOMS_BY_HOTEL = {
  'pan-pacific-singapore': [
    {
      id: 'pps-deluxe',
      title: 'Deluxe Room — Marina View',
      meta: '32 m² · King · Bathtub',
      image:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=450&fit=crop',
      pricePerNight: 420,
    },
    {
      id: 'pps-club',
      title: 'Pacific Club Room',
      meta: '36 m² · Lounge access · Evening cocktails',
      image:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=450&fit=crop',
      pricePerNight: 510,
    },
  ],
  'parkroyal-marina-bay': [
    {
      id: 'prmb-garden',
      title: 'Collection Room — Garden View',
      meta: '30 m² · Rain shower · Smart room controls',
      image:
        'https://images.unsplash.com/photo-1611892440504-42a792e54c32?w=800&h=450&fit=crop',
      pricePerNight: 398,
    },
    {
      id: 'prmb-bay',
      title: 'Bay View Suite',
      meta: '52 m² · Separate living · Soaking tub',
      image:
        'https://images.unsplash.com/photo-1596436889106-35b1c3c2e5a5?w=800&h=450&fit=crop',
      pricePerNight: 620,
    },
  ],
  'parkroyal-beach-road': [
    {
      id: 'prbr-deluxe',
      title: 'Deluxe King',
      meta: '28 m² · City view',
      image:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=450&fit=crop',
      pricePerNight: 285,
    },
    {
      id: 'prbr-club',
      title: 'Orchid Club Deluxe',
      meta: '30 m² · Club lounge · Late checkout',
      image:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=450&fit=crop',
      pricePerNight: 345,
    },
  ],
  'serviced-suites-orchard': [
    {
      id: 'pss-onebed',
      title: 'One-Bedroom Suite',
      meta: '45 m² · Kitchenette · Washer-dryer',
      image:
        'https://images.unsplash.com/photo-1584132967334-10e3decfabf2?w=800&h=450&fit=crop',
      pricePerNight: 310,
    },
    {
      id: 'pss-twobed',
      title: 'Two-Bedroom Family Suite',
      meta: '68 m² · Dual bathrooms · Dining for 4',
      image:
        'https://images.unsplash.com/photo-1631049307264-e0dd4e8a2c38?w=800&h=450&fit=crop',
      pricePerNight: 485,
    },
  ],
};

/**
 * Seasonal offers relevant to March 2026 (school holidays, Easter lead-in, F1 preview).
 * @type {Array<Object>}
 */
export const OFFERS = [
  {
    id: 'offer_mar_school_2026',
    badge: 'March School Holidays',
    title: 'Family Staycation — Kids Eat Free',
    location: 'Participating Singapore hotels',
    validThrough: 'Book by 23 Mar 2026 · Stay 15–30 Mar 2026',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=450&fit=crop',
  },
  {
    id: 'offer_easter_early_2026',
    badge: 'Easter 2026',
    title: 'Good Friday Long Weekend — 3rd Night 40% Off',
    location: 'Pan Pacific Singapore · PARKROYAL Marina Bay',
    validThrough: 'Book by 31 Mar 2026 for stays 3–6 Apr 2026',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=450&fit=crop',
  },
  {
    id: 'offer_f1_preview_2026',
    badge: 'Grand Prix Season',
    title: 'Race Weekend Preview Rate — Pacific Club Upgrade',
    location: 'Marina Bay properties',
    validThrough: 'Limited rooms · Offer ends 31 Mar 2026',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=450&fit=crop',
  },
  {
    id: 'offer_discovery_q1',
    badge: 'DISCOVERY',
    title: 'Double Points on Dining — Q1 2026',
    location: 'Singapore & regional dining outlets',
    validThrough: '1 Jan – 31 Mar 2026',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop',
  },
];

/**
 * Default booking window for demo (pre-filled dates).
 */
export const DEFAULT_STAY = {
  checkIn: '2026-03-28',
  checkOut: '2026-03-31',
};

/**
 * Find hotel by id.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getHotelById(id) {
  return HOTELS.find((h) => h.id === id);
}

/**
 * Rooms for a hotel id (empty array if none).
 * @param {string} hotelId
 * @returns {Array<Object>}
 */
export function getRoomsForHotel(hotelId) {
  return ROOMS_BY_HOTEL[hotelId] || [];
}

/**
 * Format SGD price for display.
 * @param {number} amount
 * @returns {string}
 */
export function formatSgd(amount) {
  return `S$${amount.toFixed(0)}`;
}

/**
 * @deprecated Legacy alias for archived EasyMoney screens in _backup_easymoney.
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  return formatSgd(amount);
}
