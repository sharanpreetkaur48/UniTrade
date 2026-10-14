import { Product, ServiceGig, AdminSettings, Order } from '../types';

export const INITIAL_COLLEGES = [
  'Punjab University'
];

export const UNIVERSITY_INFO = {
  name: 'Panjab University (PU) Campus Hub',
  shortName: 'Punjab University',
  hostels: [
    'Sector 14 Campus, Hostel 1',
    'Sector 14 Campus, Hostel 4',
    'Sector 14 Campus, Hostel 8',
    'Sector 25 South Campus, Hostel 9',
    'Kasturba Hall, Girls Hostel'
  ]
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Engineering Physics: Principles & Applications (10th Edition)',
    description: 'Prescribed engineering physics textbook with tutorial sheets and solved problem sets. Clean condition, minimal margin notes.',
    category: 'Textbooks',
    price: 450,
    finalPrice: 450,
    sellerSuggestedPrice: 450,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 1',
    sellerPhone: '9876543210',
    sellerName: 'Arjun Sharma',
    imageUrl: '/src/assets/images/book_engineering_textbook_1791902729557.jpg',
    images: ['/src/assets/images/book_engineering_textbook_1791902729557.jpg'],
    isBoosted: true,
    boostedUntil: '2026-11-13',
    stock: 1,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-10'
  },
  {
    id: 'prod-2',
    title: 'Handmade Artisan Macrame Wall Hanging & Dorm Plant Coaster Set',
    description: '100% organic cotton handmade macrame dorm wall hanging with custom crochet mug coaster. Handcrafted by PU student artisan.',
    category: 'Handmade Items',
    price: 299,
    finalPrice: 299,
    sellerSuggestedPrice: 320,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 4',
    sellerPhone: '9811223344',
    sellerName: 'Meher Randhawa',
    imageUrl: '/src/assets/images/handmade_campus_craft_1791909335269.jpg',
    images: ['/src/assets/images/handmade_campus_craft_1791909335269.jpg'],
    isBoosted: true,
    boostedUntil: '2026-11-12',
    stock: 3,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-11'
  },
  {
    id: 'prod-3',
    title: 'HP Prime Graphing & Scientific Calculator with Color Touchscreen',
    description: 'Perfect for engineering mathematics, calculus, and advanced circuit analysis. Battery backup holds full week charge, includes protective slide cover.',
    category: 'Calculators',
    price: 1200,
    finalPrice: 1200,
    sellerSuggestedPrice: 1250,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 8',
    sellerPhone: '9811223344',
    sellerName: 'Kunal Verma',
    imageUrl: '/src/assets/images/calculator_scientific_1791902757900.jpg',
    images: ['/src/assets/images/calculator_scientific_1791902757900.jpg'],
    isBoosted: false,
    stock: 1,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-11'
  },
  {
    id: 'prod-4',
    title: 'Sony WH-1000XM4 Noise Cancelling Wireless Headphones (Matte Black)',
    description: 'Essential for focused studying in library or hostel. 30hr battery life, immaculate audio, comes with original carry case and aux cord.',
    category: 'Electronics',
    price: 6499,
    finalPrice: 6499,
    sellerSuggestedPrice: 6500,
    condition: 'Good',
    college: 'Punjab University',
    hostelOrDept: 'Sector 25 South Campus, Hostel 9',
    sellerPhone: '9822334455',
    sellerName: 'Rhea Sen',
    imageUrl: '/src/assets/images/electronics_headphones_1791902780988.jpg',
    images: ['/src/assets/images/electronics_headphones_1791902780988.jpg'],
    isBoosted: false,
    stock: 1,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-09'
  },
  {
    id: 'prod-5',
    title: 'Hostel Room Duo: 1.5L Stainless Steel Electric Kettle + LED Study Lamp',
    description: 'Hostel lifesaver for late night tea and warm water. Paired with a dimmable touch LED desk lamp with 3 color temperatures.',
    category: 'Hostel Essentials',
    price: 750,
    finalPrice: 750,
    sellerSuggestedPrice: 800,
    condition: 'Good',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 4',
    sellerPhone: '9833445566',
    sellerName: 'Devansh Roy',
    imageUrl: '/src/assets/images/hostel_kettle_lamp_1791902805885.jpg',
    images: ['/src/assets/images/hostel_kettle_lamp_1791902805885.jpg'],
    isBoosted: true,
    boostedUntil: '2026-11-10',
    stock: 2,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-12'
  },
  {
    id: 'prod-6',
    title: 'Nike Revolution 6 Campus Running & Gym Shoes (Size UK 9)',
    description: 'Bought last semester for sports meet, used under 5 times. Breathable mesh upper, cushioned foam midsole, super clean sole grip.',
    category: 'Shoes',
    price: 1350,
    finalPrice: 1350,
    sellerSuggestedPrice: 1400,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 1',
    sellerPhone: '9844556677',
    sellerName: 'Simran Kaur',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    isBoosted: false,
    stock: 1,
    status: 'available',
    approvalStatus: 'approved',
    createdAt: '2026-10-08'
  },
  {
    id: 'prod-7',
    title: 'Hand-painted Ceramic "Creative Spark" Campus Coffee Mug & Keychain',
    description: 'Custom ceramic hand-glazed hostel mug with floral motifs, paired with a handmade macrame student keychain. Heat-resistant, microwave safe.',
    category: 'Handmade Items',
    price: 240,
    finalPrice: 240,
    sellerSuggestedPrice: 260,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Kasturba Hall, Girls Hostel',
    sellerPhone: '9876543210',
    sellerName: 'Arjun Sharma',
    imageUrl: '/src/assets/images/handmade_campus_craft_1791909335269.jpg',
    images: ['/src/assets/images/handmade_campus_craft_1791909335269.jpg'],
    isBoosted: false,
    stock: 4,
    status: 'available',
    approvalStatus: 'pending_admin',
    createdAt: '2026-10-13'
  },
  {
    id: 'prod-8',
    title: 'Casio fx-991EX ClassWiz Advanced Scientific Calculator',
    description: 'High-resolution display, 552 functions including matrix, vector calculations, and spreadsheet mode. Mandatory for semester exams.',
    category: 'Calculators',
    price: 680,
    finalPrice: 680,
    sellerSuggestedPrice: 700,
    condition: 'Like New',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 4',
    sellerPhone: '9877889900',
    sellerName: 'Aditya Pillai',
    imageUrl: '/src/assets/images/calculator_scientific_1791902757900.jpg',
    images: ['/src/assets/images/calculator_scientific_1791902757900.jpg'],
    isBoosted: false,
    stock: 1,
    status: 'available',
    approvalStatus: 'pending_admin',
    createdAt: '2026-10-13'
  }
];

export const INITIAL_GIGS: ServiceGig[] = [
  {
    id: 'gig-1',
    providerName: 'Rohan Mehra',
    providerPhone: '9876543210',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 1',
    title: 'Professional Presentation Design & Pitch Decks (PowerPoint / Canva)',
    category: 'presentation',
    price: 249,
    priceUnit: 'per 10-slide deck',
    description: 'PU final-year student with presentation awards. Clean aesthetics, custom diagrams, and executive storytelling.',
    rating: 4.9,
    completedGigs: 28
  },
  {
    id: 'gig-2',
    providerName: 'Tanya Sengupta',
    providerPhone: '9811223344',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 4',
    title: 'Graphic Design for College Clubs, Hackathons & Social Media Posters',
    category: 'graphic_design',
    price: 199,
    priceUnit: 'per graphic/poster',
    description: 'UI/Graphic Designer with Adobe Illustrator & Figma expertise. Quick turnaround within 24 hours for campus events.',
    rating: 5.0,
    completedGigs: 42
  },
  {
    id: 'gig-3',
    providerName: 'Yash Vardhan',
    providerPhone: '9822334455',
    college: 'Punjab University',
    hostelOrDept: 'Sector 14 Campus, Hostel 8',
    title: 'Data Structures & Algorithms Exam Prep & Code Review (C++ / Python)',
    category: 'tutoring',
    price: 250,
    priceUnit: 'per 1-hour session',
    description: 'Incoming SDE intern. I break down recursion, DP, trees, and graphs into intuitive mental models for college tests.',
    rating: 4.95,
    completedGigs: 36
  },
  {
    id: 'gig-4',
    providerName: 'Ananya Kapoor',
    providerPhone: '9833445566',
    college: 'Punjab University',
    hostelOrDept: 'Kasturba Hall, Girls Hostel',
    title: 'Campus Life Mentorship, Placement Resume Review & 1-on-1 Talking',
    category: 'mentoring_chat',
    price: 99,
    priceUnit: 'per 30 min chat',
    description: 'Need an experienced senior to vent to about hostel life, professors, or need a calm sounding board? Friendly, confidential 1-on-1 talk.',
    rating: 4.88,
    completedGigs: 19
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  boostFee: 49,
  localDeliveryFee: 10,
  regionalDeliveryFee: 50
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      }
    ],
    buyerPhone: '9900112233',
    buyerName: 'Rahul Deshmukh',
    college: 'Punjab University',
    deliveryAddress: 'Sector 14 Campus, Hostel 1, Room 204',
    hostelAddress: 'Sector 14 Campus, Hostel 1, Room 204',
    deliveryType: 'local',
    deliveryFee: 10,
    subtotal: 450,
    totalAmount: 460,
    paymentMode: 'Cash on Delivery',
    status: 'out_for_delivery',
    sellerNotifiedForReview: false,
    createdAt: '2026-10-12T14:30:00Z'
  },
  {
    id: 'ORD-7714',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1
      }
    ],
    buyerPhone: '9911223344',
    buyerName: 'Sneha Gupta',
    college: 'Punjab University',
    deliveryAddress: 'Sector 14 Campus, Hostel 4, Room 112',
    hostelAddress: 'Sector 14 Campus, Hostel 4, Room 112',
    deliveryType: 'pickup',
    deliveryFee: 0,
    subtotal: 299,
    totalAmount: 299,
    paymentMode: 'Cash on Delivery',
    status: 'delivered',
    sellerNotifiedForReview: true,
    createdAt: '2026-10-11T10:15:00Z'
  }
];
