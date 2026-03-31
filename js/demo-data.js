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

/** DISCOVERY loyalty demo values (same keys as Braze custom attributes). */
export const DEMO_LOYALTY = {
  pphg_loyalty_id: 'DISC-SG-77821',
  pphg_loyalty_points: 12400,
  pphg_loyalty_tier: 'Gold',
};

/** Hero for Book home — Marina Bay skyline */
export const BOOK_HERO = {
  image:
    'https://images.unsplash.com/photo-1605425183435-25b7e99104a4?w=900&h=1200&fit=crop',
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
      'https://www.panpacific.com/content/dam/pphg-revamp/en/global/hotels-and-resorts/ppsin-property.jpg',
    images: [
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/pphg2-0/homepage/ppsin-homepage-property-highlight-1.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/pphg2-0/homepage/ppsin-homepage-property-highlight-2.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/pphg2-0/homepage/ppsin-homepage-property-introduction-2.jpg',
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
      'https://www.panpacific.com/content/dam/pphg-revamp/en/global/hotels-and-resorts/prsmb-property4.jpg',
    images: [
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/prc2-0/homepage/PRSMB_Property_Highlights_Main_Image.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/prc2-0/homepage/PRSMB_Property_Highlights_Image_1.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/prc2-0/homepage/PRSMB_Property_Highlights_Image_2.jpg',
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
      'https://www.panpacific.com/content/dam/pphg-revamp/en/global/hotels-and-resorts/prsin-property-april2021.jpg',
    images: [
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsin/pr-2-0/homepage/PRSIN_Masthead_Image.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsin/pr-2-0/homepage/PRSIN_Property_Highlights_Image_1.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsin/pr-2-0/homepage/PRSIN_Property_Highlights_Image_2.jpg',
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
      'https://www.panpacific.com/content/dam/pphg-revamp/en/global/serviced-suites/ppssin-property.jpg',
    images: [
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppssin/pphg2-0/homepage/PPSSIN_Masthead_Image.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppssin/pphg2-0/homepage/PPSSIN_Property_Highlights_Image_1.jpg',
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppssin/pphg2-0/homepage/PPSSIN_Property_Highlights_Image_2.jpg',
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
        'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/rooms/panoramic-room/ppsin-rooms-panoramic-king-bedroom-2022-hero.jpg',
      pricePerNight: 420,
    },
    {
      id: 'pps-club',
      title: 'Pacific Club Room',
      meta: '36 m² · Lounge access · Evening cocktails',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/rooms/premier-marina-bay/ppsin-rooms-executive-marina-bay-king-2-hero.jpg',
      pricePerNight: 510,
    },
  ],
  'parkroyal-marina-bay': [
    {
      id: 'prmb-garden',
      title: 'Collection Room — Garden View',
      meta: '30 m² · Rain shower · Smart room controls',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/prc2-0/rooms/signature-marina-bay-room/PRSMB_SignatureMarinaBayRoom_Room_Feature_Image.jpg',
      pricePerNight: 398,
    },
    {
      id: 'prmb-bay',
      title: 'Bay View Suite',
      meta: '52 m² · Separate living · Soaking tub',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/prc2-0/rooms/signature-marina-bay-suite/PRSMB_SignatureMarinaBaySuite_Room_Feature_Image.jpg',
      pricePerNight: 620,
    },
  ],
  'parkroyal-beach-road': [
    {
      id: 'prbr-deluxe',
      title: 'Deluxe King',
      meta: '28 m² · City view',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/prsin/pr-2-0/sleep/deluxe-room/PRSIN_Deluxe_Room_Feature_Image.jpg',
      pricePerNight: 285,
    },
    {
      id: 'prbr-club',
      title: 'Orchid Club Deluxe',
      meta: '30 m² · Club lounge · Late checkout',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/prsin/pr-2-0/sleep/parkroyal-club-deluxe-room/PRSIN_ClubDeluxe_Room_Feature_Image.jpg',
      pricePerNight: 345,
    },
  ],
  'serviced-suites-orchard': [
    {
      id: 'pss-onebed',
      title: 'One-Bedroom Suite',
      meta: '45 m² · Kitchenette · Washer-dryer',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/ppssin/pphg2-0/rooms/one-bedroom-deluxe-suite/PPSSIN_OneBedroomDeluxe_Listing_Image.jpg',
      pricePerNight: 310,
    },
    {
      id: 'pss-twobed',
      title: 'Two-Bedroom Family Suite',
      meta: '68 m² · Dual bathrooms · Dining for 4',
      image:
        'https://www.panpacific.com/content/dam/pphg-revamp/en/ppssin/pphg2-0/rooms/two-bedroom-executive-suite/PPSSIN_TwoBedroomExecutive_Listing_Image.jpg',
      pricePerNight: 485,
    },
  ],
};

/**
 * Singapore offers aligned with panpacific.com hub categories: Spa first, then Rooms and Suites.
 * Copy and dates mirror official offer detail pages (participating properties include Singapore).
 * @type {Array<Object>}
 */
export const OFFERS = [
  {
    id: 'offer_9d_breathwork_ppsor',
    badge: 'Spa',
    title: '9D Breathwork Activation',
    location: 'Singapore — Pan Pacific Orchard',
    validThrough:
      'Book 30 Mar–23 Apr 2026 · Session 25 Apr 2026, 3pm–5pm (advance registration)',
    image:
      'https://www.panpacific.com/content/dam/pphg-revamp/ja/ppsor/offers/detail/PPSOR_9DBreathworkActivation_Masthead_Image.jpg',
  },
  {
    id: 'offer_ruby_spa_ppsin',
    badge: 'Spa',
    title: 'Ruby Spa Package',
    location: 'Singapore — Pan Pacific Singapore (St. Gregory Spa)',
    validThrough: 'Spa credits valid 12 months from purchase · See offer T&C',
    image:
      'https://www.panpacific.com/content/dam/pphg-revamp/en/ppsin/offers/listing/ppsin-offers-st-gregory-spa-ruby-package-hero.jpg',
  },
  {
    id: 'offer_third_night_sg',
    badge: 'Rooms and Suites',
    title: 'Third Night on Us',
    location:
      'Singapore — Pan Pacific Singapore, Orchard, Marina Bay, Pickering, Beach Road & serviced suites',
    validThrough:
      'Book 3 Mar–28 Apr 2026 · Stay 3 Mar–30 Apr 2026 (Club rooms & suites)',
    image:
      'https://www.panpacific.com/content/dam/pphg-revamp/en/global/offers/third-night-on-us/Global_Offer_Club_Suites_Masthead.jpg',
  },
  {
    id: 'offer_gnomes_prsmb',
    badge: 'Rooms and Suites',
    title: "Welcome to Gnome's Land",
    location: 'Singapore — PARKROYAL COLLECTION Marina Bay',
    validThrough:
      'Book 2 Jan–31 Dec 2026 · Stay through 31 Dec 2026 (Gnome\'s Burrow & Treehouse)',
    image:
      'https://www.panpacific.com/content/dam/pphg-revamp/en/prsmb/offers/listing/welcome-to-the-gnomes-land/prsmb-rooms-gnomes-treehouse-2160x750-resized.jpg',
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
