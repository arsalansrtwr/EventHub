import {
  User,
  Category,
  Event,
  Attribute,
  EventAttribute,
  Order,
  OrderItem,
  SimulatedEmail,
  EnrichedEvent,
  EnrichedOrder,
  EnrichedOrderItem,
  OrderStatus,
  FilterOptions,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'eventhub_users_pk_v4',
  CATEGORIES: 'eventhub_categories_pk_v4',
  EVENTS: 'eventhub_events_pk_v4',
  ATTRIBUTES: 'eventhub_attributes_pk_v4',
  EVENT_ATTRIBUTES: 'eventhub_event_attributes_pk_v4',
  ORDERS: 'eventhub_orders_pk_v4',
  ORDER_ITEMS: 'eventhub_order_items_pk_v4',
  EMAILS: 'eventhub_emails_pk_v4',
  CURRENT_USER: 'eventhub_current_user_pk_v4',
};

// Seed Categories
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Music & Concerts', slug: 'music', description: 'Live concerts, Sufi Qawwali nights, and Coke Studio festivals', icon: 'Music' },
  { id: 'cat-2', name: 'Tech & Startups', slug: 'tech', description: 'Software engineering summits, AI keynotes, and founder showcases', icon: 'Cpu' },
  { id: 'cat-3', name: 'Theater & Arts', slug: 'arts', description: 'Classical Urdu dramas, ballet, and literary festivals', icon: 'Sparkles' },
  { id: 'cat-4', name: 'Sports & PSL Cricket', slug: 'sports', description: 'PSL championship matches, football leagues, and arena clashes', icon: 'Trophy' },
  { id: 'cat-5', name: 'Food & Cultural Melas', slug: 'workshops', description: 'Culinary festivals, traditional handicrafts, and heritage showcases', icon: 'BookOpen' },
  { id: 'cat-6', name: 'Stand-Up & Comedy', slug: 'comedy', description: 'Live satirical stand-up comedy specials and open-mic nights', icon: 'Mic' },
];

// Seed Attributes
const INITIAL_ATTRIBUTES: Attribute[] = [
  { id: 'attr-city', name: 'city' },
  { id: 'attr-lang', name: 'language' },
  { id: 'attr-age', name: 'age_limit' },
  { id: 'attr-dur', name: 'duration' },
];

// Seed Events across Pakistan (Karachi, Lahore, Islamabad)
const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-101',
    category_id: 'cat-1',
    title: 'Coke Studio Live 2026: Sufi Rock & Acoustic Fusion',
    description: 'Experience powerhouse live vocal performances, traditional sarangi rhythms, and modular synth fusion featuring Atif Aslam, Ali Sethi, and Shae Gill under the open night sky at Beach View Clifton.',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-11-20T20:00:00',
    venue: 'Beach View Park, Clifton, Karachi',
    price: 4500, // PKR
    seats_available: 285,
    total_seats: 400,
    featured: true,
  },
  {
    id: 'evt-102',
    category_id: 'cat-4',
    title: 'PSL 11 Grand Final: Lahore Qalandars vs Karachi Kings',
    description: 'The ultimate high-voltage cricket derby of Pakistan. Witness explosive T20 floodlit cricket, courtside VIP enclosures, electrifying stadium commentary, and the champion trophy presentation.',
    poster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-11-28T19:30:00',
    venue: 'Gaddafi Stadium, Ferozepur Road, Lahore',
    price: 3500, // PKR
    seats_available: 480,
    total_seats: 650,
    featured: true,
  },
  {
    id: 'evt-103',
    category_id: 'cat-1',
    title: 'Sufi Qawwali Night: Ustad Rahat Fateh Ali Khan & Fareed Ayaz',
    description: 'A spiritual musical evening honoring Amir Khusro and classical Sufi kalam. Soulful harmonium harmonies, tabla jugalbandi, and timeless melodies in an acoustically tuned auditorium.',
    poster: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-05T20:30:00',
    venue: 'Alhamra Arts Centre, Hall 1, Mall Road, Lahore',
    price: 5000, // PKR
    seats_available: 92,
    total_seats: 180,
    featured: false,
  },
  {
    id: 'evt-104',
    category_id: 'cat-2',
    title: 'Pakistan Tech & AI Innovation Summit 2026',
    description: 'Pakistan’s premier software engineering, fintech, and venture capital conference. Three stages covering generative models, autonomous robotics, global diaspora networking, and unicorn pitches.',
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-12T09:00:00',
    venue: 'Lahore Expo Centre, Trade Centre Commercial Area, Johar Town, Lahore',
    price: 7500, // PKR
    seats_available: 215,
    total_seats: 350,
    featured: true,
  },
  {
    id: 'evt-105',
    category_id: 'cat-3',
    title: 'Karachi Literature Festival (KLF) 17th Edition',
    description: 'Three days of vibrant literary dialogues, Urdu poetry mushairas, investigative journalism debates, book launches, and book signings with internationally acclaimed South Asian authors.',
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-18T10:00:00',
    venue: 'Arts Council of Pakistan, M.R. Kiyani Road, Karachi',
    price: 1500, // PKR
    seats_available: 340,
    total_seats: 500,
    featured: false,
  },
  {
    id: 'evt-106',
    category_id: 'cat-3',
    title: 'The Legend of Anarkali: Live Urdu Musical Drama',
    description: 'A grand revival of Pakistan’s most celebrated classical love story. Featuring authentic Mughal period costuming, live sitar and sarangi accompaniment, and stellar dramatic performances.',
    poster: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-22T19:00:00',
    venue: 'PNCA National Art Gallery Auditorium, Sector F-5/1, Islamabad',
    price: 2800, // PKR
    seats_available: 78,
    total_seats: 150,
    featured: false,
  },
  {
    id: 'evt-107',
    category_id: 'cat-5',
    title: 'Lahore Food, Music & Heritage Mela 2026',
    description: 'Over 80 curated food stalls serving authentic Old Lahore delicacies, Nihari, Karahi, and traditional street snacks, alongside underground indie acoustic gigs and folk dance troupes.',
    poster: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-29T16:00:00',
    venue: 'Royal Palm Golf & Country Club, Canal Bank Road, Lahore',
    price: 1200, // PKR
    seats_available: 195,
    total_seats: 300,
    featured: false,
  },
  {
    id: 'evt-108',
    category_id: 'cat-6',
    title: 'Karachi Comedy Club: Uncensored Live Stand-Up',
    description: 'An evening of unapologetic observational satire, Pakistani cultural humor, and lightning-fast crowd work featuring four of the country’s top touring stand-up acts.',
    poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80',
    event_date: '2027-01-09T21:00:00',
    venue: 'Arts Council Studio 2, Karachi',
    price: 2000, // PKR
    seats_available: 48,
    total_seats: 90,
    featured: false,
  },
];

// Seed Event Attributes
const INITIAL_EVENT_ATTRIBUTES: EventAttribute[] = [
  { event_id: 'evt-101', attribute_id: 'attr-city', value: 'Karachi' },
  { event_id: 'evt-101', attribute_id: 'attr-lang', value: 'Urdu / Punjabi' },
  { event_id: 'evt-101', attribute_id: 'attr-age', value: 'All Ages' },
  { event_id: 'evt-101', attribute_id: 'attr-dur', value: '4 Hours' },

  { event_id: 'evt-102', attribute_id: 'attr-city', value: 'Lahore' },
  { event_id: 'evt-102', attribute_id: 'attr-lang', value: 'Urdu / English' },
  { event_id: 'evt-102', attribute_id: 'attr-age', value: 'All Ages' },
  { event_id: 'evt-102', attribute_id: 'attr-dur', value: '3h 30m' },

  { event_id: 'evt-103', attribute_id: 'attr-city', value: 'Lahore' },
  { event_id: 'evt-103', attribute_id: 'attr-lang', value: 'Urdu' },
  { event_id: 'evt-103', attribute_id: 'attr-age', value: 'All Ages' },
  { event_id: 'evt-103', attribute_id: 'attr-dur', value: '3 Hours' },

  { event_id: 'evt-104', attribute_id: 'attr-city', value: 'Lahore' },
  { event_id: 'evt-104', attribute_id: 'attr-lang', value: 'English / Urdu' },
  { event_id: 'evt-104', attribute_id: 'attr-age', value: '16+' },
  { event_id: 'evt-104', attribute_id: 'attr-dur', value: '2 Days' },

  { event_id: 'evt-105', attribute_id: 'attr-city', value: 'Karachi' },
  { event_id: 'evt-105', attribute_id: 'attr-lang', value: 'Urdu / English' },
  { event_id: 'evt-105', attribute_id: 'attr-age', value: 'All Ages' },
  { event_id: 'evt-105', attribute_id: 'attr-dur', value: '3 Days' },

  { event_id: 'evt-106', attribute_id: 'attr-city', value: 'Islamabad' },
  { event_id: 'evt-106', attribute_id: 'attr-lang', value: 'Urdu' },
  { event_id: 'evt-106', attribute_id: 'attr-age', value: '10+' },
  { event_id: 'evt-106', attribute_id: 'attr-dur', value: '2h 15m' },

  { event_id: 'evt-107', attribute_id: 'attr-city', value: 'Lahore' },
  { event_id: 'evt-107', attribute_id: 'attr-lang', value: 'Punjabi / Urdu' },
  { event_id: 'evt-107', attribute_id: 'attr-age', value: 'Family' },
  { event_id: 'evt-107', attribute_id: 'attr-dur', value: '6 Hours' },

  { event_id: 'evt-108', attribute_id: 'attr-city', value: 'Karachi' },
  { event_id: 'evt-108', attribute_id: 'attr-lang', value: 'Urdu / English' },
  { event_id: 'evt-108', attribute_id: 'attr-age', value: '16+' },
  { event_id: 'evt-108', attribute_id: 'attr-dur', value: '2 Hours' },
];

// Seed Pakistani Users with Membership Tiers
const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Dur-e-Adan',
    email: 'dureadan@gmail.com',
    password_hash: '$2y$10$e8w4M7e2Kj0Q9m1N8Lp6Zu8aN4O1T9e5V3B1C4D7F9G2H5J8K1',
    role: 'customer',
    phone: '+92 300 8472910',
    city: 'Karachi & Lahore',
    membership_tier: 'vip',
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'usr-customer-2',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@gmail.com',
    password_hash: '$2y$10$e8w4M7e2Kj0Q9m1N8Lp6Zu8aN4O1T9e5V3B1C4D7F9G2H5J8K1',
    role: 'customer',
    phone: '+92 321 4455667',
    city: 'Karachi',
    membership_tier: 'standard',
    created_at: '2026-10-20T12:00:00Z',
  },
  {
    id: 'usr-admin-1',
    name: 'Box Office Operations',
    email: 'admin@eventhub.pk',
    password_hash: '$2y$10$w8k2L9m4Q1N8P6Z3aN7O1T9e5V3B1C4D7F9G2H5J8K1L4M7E2J0',
    role: 'admin',
    phone: '+92 21 111-383-684',
    city: 'National Box Office HQ',
    membership_tier: 'vip',
    created_at: '2026-09-01T08:30:00Z',
  },
];

// Seed Initial Orders in PKR
const INITIAL_ORDERS: Order[] = [
  {
    id: 'PK-94021',
    user_id: 'usr-customer-1',
    attendee_name: 'Dur-e-Adan',
    attendee_email: 'dureadan@gmail.com',
    attendee_phone: '+92 300 8472910',
    payment_method: 'easypaisa',
    status: 'confirmed',
    total_amount: 9000,
    created_at: '2026-11-01T14:22:00Z',
    notes: 'Gate 3 VIP Parking Pass requested.',
  },
  {
    id: 'PK-94022',
    user_id: 'usr-customer-1',
    attendee_name: 'Dur-e-Adan & Guests',
    attendee_email: 'dureadan@gmail.com',
    attendee_phone: '+92 300 8472910',
    payment_method: 'jazzcash',
    status: 'pending',
    total_amount: 7000,
    created_at: '2026-11-04T16:10:00Z',
    notes: 'Javed Miandad Enclosure confirmation.',
  },
];

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  {
    id: 'item-1',
    order_id: 'PK-94021',
    event_id: 'evt-101',
    quantity: 2,
    price: 4500,
    seat_numbers: ['VIP-04', 'VIP-05'],
  },
  {
    id: 'item-2',
    order_id: 'PK-94022',
    event_id: 'evt-102',
    quantity: 2,
    price: 3500,
    seat_numbers: ['C-12', 'C-13'],
  },
];

// Seed Confirmation Emails
const INITIAL_EMAILS: SimulatedEmail[] = [
  {
    id: 'mail-1',
    order_id: 'PK-94021',
    to_email: 'dureadan@gmail.com',
    to_name: 'Dur-e-Adan',
    subject: 'Official Pass Issued: Coke Studio Live Karachi 2026 (#PK-94021)',
    body: `Dear Dur-e-Adan,\n\nYour booking #PK-94021 for "Coke Studio Live 2026: Sufi Rock & Acoustic Fusion" has been confirmed by the EventHub Pakistan Box Office.\n\nAllocated Seats: VIP-04, VIP-05\nVenue: Beach View Park, Clifton, Karachi\nEvent Date: November 20, 2026 at 20:00 PKT\nPayment: Rs. 9,000 (Paid via Easypaisa Wallet)\n\nPlease present the attached digital QR voucher on your smartphone at Gate 2 for barcode turnstile clearance.\n\nHelpline: +92 (21) 111-383-684\nEventHub Pakistan Box Office`,
    sent_at: '2026-11-01T14:25:00Z',
    type: 'order_confirmed',
    read: true,
  },
  {
    id: 'mail-2',
    order_id: 'PK-94022',
    to_email: 'dureadan@gmail.com',
    to_name: 'Dur-e-Adan',
    subject: 'Booking Received: PSL 11 Grand Final Gaddafi Stadium (#PK-94022)',
    body: `Dear Dur-e-Adan,\n\nYour reservation request for 2x tickets to the PSL 11 Grand Final (Lahore Qalandars vs Karachi Kings) has been received.\n\nSeats: C-12, C-13\nVenue: Gaddafi Stadium, Lahore\nAmount: Rs. 7,000 (JazzCash Transaction ID: JC-8841920)\n\nAn event administrator is processing your seating allocation. You will receive an instant push update upon turnstile pass dispatch.\n\nEventHub Pakistan`,
    sent_at: '2026-11-04T16:11:00Z',
    type: 'order_pending',
    read: false,
  },
];

class DatabaseService {
  private users: User[] = [];
  private categories: Category[] = [];
  private events: Event[] = [];
  private attributes: Attribute[] = [];
  private event_attributes: EventAttribute[] = [];
  private orders: Order[] = [];
  private order_items: OrderItem[] = [];
  private emails: SimulatedEmail[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.init();
  }

  private init() {
    this.categories = this.load(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.attributes = this.load(STORAGE_KEYS.ATTRIBUTES, INITIAL_ATTRIBUTES);
    this.events = this.load(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.event_attributes = this.load(STORAGE_KEYS.EVENT_ATTRIBUTES, INITIAL_EVENT_ATTRIBUTES);
    this.users = this.load(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.orders = this.load(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    this.order_items = this.load(STORAGE_KEYS.ORDER_ITEMS, INITIAL_ORDER_ITEMS);
    this.emails = this.load(STORAGE_KEYS.EMAILS, INITIAL_EMAILS);

    const savedUser = this.load<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (savedUser) {
      this.currentUser = savedUser;
    } else {
      this.currentUser = this.users[0] || null;
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage quota or private mode fallback
    }
  }

  public resetToSeedData() {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ATTRIBUTES);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.EVENT_ATTRIBUTES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.ORDER_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    this.categories = [...INITIAL_CATEGORIES];
    this.attributes = [...INITIAL_ATTRIBUTES];
    this.events = [...INITIAL_EVENTS];
    this.event_attributes = [...INITIAL_EVENT_ATTRIBUTES];
    this.users = [...INITIAL_USERS];
    this.orders = [...INITIAL_ORDERS];
    this.order_items = [...INITIAL_ORDER_ITEMS];
    this.emails = [...INITIAL_EMAILS];
    this.currentUser = this.users[0];

    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    this.save(STORAGE_KEYS.ATTRIBUTES, this.attributes);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.save(STORAGE_KEYS.EVENT_ATTRIBUTES, this.event_attributes);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.save(STORAGE_KEYS.ORDERS, this.orders);
    this.save(STORAGE_KEYS.ORDER_ITEMS, this.order_items);
    this.save(STORAGE_KEYS.EMAILS, this.emails);
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
  }

  // --- Users & Authentication ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public login(email: string, passwordAttempt: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }
    this.currentUser = user;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return { success: true, user };
  }

  public register(
    name: string,
    email: string,
    passwordAttempt: string,
    role: 'customer' | 'admin' = 'customer',
    phone?: string,
    city?: string,
    membership_tier: 'standard' | 'vip' = 'standard'
  ): { success: boolean; user?: User; error?: string } {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return { success: false, error: 'An account with this email address is already registered.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: `$2y$10$hashed_${Date.now()}`,
      role,
      phone: phone?.trim() || '+92 300 1234567',
      city: city?.trim() || 'Karachi',
      membership_tier,
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.currentUser = newUser;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return { success: true, user: newUser };
  }

  public updateUserProfile(userId: string, updates: Partial<User>): { success: boolean; user?: User } {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return { success: false };

    Object.assign(user, updates);
    this.save(STORAGE_KEYS.USERS, this.users);

    if (this.currentUser?.id === userId) {
      this.currentUser = { ...user };
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }

    return { success: true, user };
  }

  public logout(): void {
    this.currentUser = null;
    this.save(STORAGE_KEYS.CURRENT_USER, null);
  }

  public switchRole(role: 'customer' | 'admin'): User {
    const targetUser = this.users.find((u) => u.role === role);
    if (targetUser) {
      this.currentUser = targetUser;
    } else {
      this.currentUser = {
        id: `usr-${role}-${Date.now()}`,
        name: role === 'admin' ? 'Box Office Operations' : 'Dur-e-Adan',
        email: role === 'admin' ? 'admin@eventhub.pk' : 'dureadan@gmail.com',
        password_hash: 'hash',
        role,
        created_at: new Date().toISOString(),
      };
      this.users.push(this.currentUser);
      this.save(STORAGE_KEYS.USERS, this.users);
    }
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    return this.currentUser;
  }

  // --- Categories & Attributes ---
  public getCategories(): (Category & { eventCount: number })[] {
    return this.categories.map((c) => ({
      ...c,
      eventCount: this.events.filter((e) => e.category_id === c.id).length,
    }));
  }

  public createCategory(name: string, description?: string): Category {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      icon: 'Tag',
    };
    this.categories.push(newCat);
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return newCat;
  }

  public updateCategory(id: string, name: string, description?: string): boolean {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) return false;
    cat.name = name.trim();
    cat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (description !== undefined) cat.description = description;
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return true;
  }

  public deleteCategory(id: string): { success: boolean; error?: string } {
    const hasEvents = this.events.some((e) => e.category_id === id);
    if (hasEvents) {
      return { success: false, error: 'Cannot delete category that currently has active event listings.' };
    }
    this.categories = this.categories.filter((c) => c.id !== id);
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return { success: true };
  }

  public getDistinctCities(): string[] {
    const cities = new Set<string>();
    this.event_attributes
      .filter((ea) => ea.attribute_id === 'attr-city')
      .forEach((ea) => cities.add(ea.value));
    return Array.from(cities).sort();
  }

  // --- Events Querying ---
  public getEvents(filters?: FilterOptions): EnrichedEvent[] {
    const categoriesMap = new Map<string, string>();
    this.categories.forEach((c) => categoriesMap.set(c.id, c.name));

    const attributesMap = new Map<string, string>();
    this.attributes.forEach((a) => attributesMap.set(a.id, a.name));

    let list = this.events.map((e) => {
      const attrsForEvent = this.event_attributes.filter((ea) => ea.event_id === e.id);
      const attrsObj: Record<string, string> = {};
      attrsForEvent.forEach((ea) => {
        const attrName = attributesMap.get(ea.attribute_id) || ea.attribute_id;
        attrsObj[attrName] = ea.value;
      });

      return {
        ...e,
        categoryName: categoriesMap.get(e.category_id) || 'General',
        attributes: attrsObj,
      };
    });

    if (filters) {
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            (e.attributes.city && e.attributes.city.toLowerCase().includes(q))
        );
      }

      if (filters.categoryId && filters.categoryId !== 'all') {
        list = list.filter((e) => e.category_id === filters.categoryId);
      }

      if (filters.city && filters.city !== 'all') {
        list = list.filter((e) => e.attributes.city === filters.city);
      }

      if (filters.language && filters.language !== 'all') {
        list = list.filter((e) => e.attributes.language && e.attributes.language.toLowerCase().includes(filters.language.toLowerCase()));
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        list = list.filter((e) => e.price <= filters.maxPrice);
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'date_asc':
            list.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
            break;
          case 'date_desc':
            list.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
            break;
          case 'price_asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            list.sort((a, b) => b.price - a.price);
            break;
        }
      }
    }

    return list;
  }

  public getEventById(id: string): EnrichedEvent | null {
    const events = this.getEvents();
    return events.find((e) => e.id === id) || null;
  }

  public createEvent(
    eventData: Omit<Event, 'id'>,
    attributes: { city?: string; language?: string; age_limit?: string; duration?: string } = {}
  ): EnrichedEvent {
    const newId = `evt-${Date.now()}`;
    const newEvent: Event = {
      ...eventData,
      id: newId,
    };
    this.events.unshift(newEvent);
    this.save(STORAGE_KEYS.EVENTS, this.events);

    if (attributes.city) {
      this.event_attributes.push({ event_id: newId, attribute_id: 'attr-city', value: attributes.city });
    }
    if (attributes.language) {
      this.event_attributes.push({ event_id: newId, attribute_id: 'attr-lang', value: attributes.language });
    }
    if (attributes.age_limit) {
      this.event_attributes.push({ event_id: newId, attribute_id: 'attr-age', value: attributes.age_limit });
    }
    if (attributes.duration) {
      this.event_attributes.push({ event_id: newId, attribute_id: 'attr-dur', value: attributes.duration });
    }
    this.save(STORAGE_KEYS.EVENT_ATTRIBUTES, this.event_attributes);

    return this.getEventById(newId)!;
  }

  public updateEvent(
    id: string,
    eventData: Partial<Event>,
    attributes?: { city?: string; language?: string; age_limit?: string; duration?: string }
  ): boolean {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;

    this.events[idx] = { ...this.events[idx], ...eventData };
    this.save(STORAGE_KEYS.EVENTS, this.events);

    if (attributes) {
      this.event_attributes = this.event_attributes.filter((ea) => ea.event_id !== id);
      if (attributes.city) {
        this.event_attributes.push({ event_id: id, attribute_id: 'attr-city', value: attributes.city });
      }
      if (attributes.language) {
        this.event_attributes.push({ event_id: id, attribute_id: 'attr-lang', value: attributes.language });
      }
      if (attributes.age_limit) {
        this.event_attributes.push({ event_id: id, attribute_id: 'attr-age', value: attributes.age_limit });
      }
      if (attributes.duration) {
        this.event_attributes.push({ event_id: id, attribute_id: 'attr-dur', value: attributes.duration });
      }
      this.save(STORAGE_KEYS.EVENT_ATTRIBUTES, this.event_attributes);
    }

    return true;
  }

  public deleteEvent(id: string): { success: boolean; error?: string } {
    const hasOrders = this.order_items.some((oi) => oi.event_id === id);
    if (hasOrders) {
      return { success: false, error: 'Cannot delete event that has existing customer bookings attached.' };
    }
    this.events = this.events.filter((e) => e.id !== id);
    this.event_attributes = this.event_attributes.filter((ea) => ea.event_id !== id);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    this.save(STORAGE_KEYS.EVENT_ATTRIBUTES, this.event_attributes);
    return { success: true };
  }

  // --- Orders & Bookings ---
  public createBooking(data: {
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    paymentMethod: Order['payment_method'];
    notes?: string;
    items: { eventId: string; quantity: number; seatNumbers?: string[] }[];
  }): { success: boolean; order?: EnrichedOrder; error?: string } {
    for (const item of data.items) {
      const evt = this.events.find((e) => e.id === item.eventId);
      if (!evt) {
        return { success: false, error: `Event with ID "${item.eventId}" not found.` };
      }
      if (evt.seats_available < item.quantity) {
        return {
          success: false,
          error: `Insufficient seats for "${evt.title}". Only ${evt.seats_available} seats remaining.`,
        };
      }
    }

    const orderId = `PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const userId = this.currentUser ? this.currentUser.id : `usr-guest-${Date.now()}`;
    let totalAmount = 0;

    const createdItems: OrderItem[] = [];

    data.items.forEach((item, index) => {
      const evt = this.events.find((e) => e.id === item.eventId)!;
      const itemPrice = evt.price;
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      evt.seats_available = Math.max(0, evt.seats_available - item.quantity);

      createdItems.push({
        id: `item-${Date.now()}-${index}`,
        order_id: orderId,
        event_id: evt.id,
        quantity: item.quantity,
        price: itemPrice,
        seat_numbers: item.seatNumbers || [],
      });
    });

    const newOrder: Order = {
      id: orderId,
      user_id: userId,
      attendee_name: data.attendeeName.trim(),
      attendee_email: data.attendeeEmail.toLowerCase().trim(),
      attendee_phone: data.attendeePhone.trim(),
      payment_method: data.paymentMethod,
      status: 'confirmed',
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
      notes: data.notes,
    };

    this.orders.unshift(newOrder);
    this.order_items.push(...createdItems);

    this.save(STORAGE_KEYS.ORDERS, this.orders);
    this.save(STORAGE_KEYS.ORDER_ITEMS, this.order_items);
    this.save(STORAGE_KEYS.EVENTS, this.events);

    const firstEvent = this.events.find((e) => e.id === data.items[0]?.eventId);
    const emailSubject = `Official Digital Pass Confirmed: ${firstEvent?.title || 'Event Booking'} (#${orderId})`;
    const emailBody = `Dear ${newOrder.attendee_name},\n\nYour event booking #${orderId} is confirmed by EventHub Pakistan Box Office.\n\nTotal Paid: Rs. ${newOrder.total_amount.toLocaleString()} (Via ${newOrder.payment_method.toUpperCase()})\nTickets Reserved: ${createdItems.reduce((s, i) => s + i.quantity, 0)}\nPrimary Venue: ${firstEvent?.venue || 'Venue'}\n\nPlease present your digital pass QR code at the entrance turnstile for direct entry.\n\nHelpline: +92 (21) 111-383-684\nEventHub Pakistan Box Office`;

    const notificationEmail: SimulatedEmail = {
      id: `mail-${Date.now()}`,
      order_id: orderId,
      to_email: newOrder.attendee_email,
      to_name: newOrder.attendee_name,
      subject: emailSubject,
      body: emailBody,
      sent_at: new Date().toISOString(),
      type: 'order_confirmed',
      read: false,
    };

    this.emails.unshift(notificationEmail);
    this.save(STORAGE_KEYS.EMAILS, this.emails);

    return {
      success: true,
      order: this.enrichOrder(newOrder),
    };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): { success: boolean; order?: EnrichedOrder; error?: string } {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    const oldStatus = order.status;
    order.status = newStatus;
    this.save(STORAGE_KEYS.ORDERS, this.orders);

    if (oldStatus !== 'cancelled' && newStatus === 'cancelled') {
      const items = this.order_items.filter((oi) => oi.order_id === orderId);
      items.forEach((item) => {
        const evt = this.events.find((e) => e.id === item.event_id);
        if (evt) {
          evt.seats_available = Math.min(evt.total_seats, evt.seats_available + item.quantity);
        }
      });
      this.save(STORAGE_KEYS.EVENTS, this.events);

      const cancelEmail: SimulatedEmail = {
        id: `mail-${Date.now()}`,
        order_id: orderId,
        to_email: order.attendee_email,
        to_name: order.attendee_name,
        subject: `Order Cancellation Notice: #${orderId}`,
        body: `Dear ${order.attendee_name},\n\nYour booking #${orderId} has been cancelled. Any reserved seats have been released back to event inventory.\n\nIf you have questions regarding payment refund, please contact support@eventhub.pk.`,
        sent_at: new Date().toISOString(),
        type: 'order_cancelled',
        read: false,
      };
      this.emails.unshift(cancelEmail);
      this.save(STORAGE_KEYS.EMAILS, this.emails);
    } else if (newStatus === 'confirmed' && oldStatus === 'pending') {
      const confirmEmail: SimulatedEmail = {
        id: `mail-${Date.now()}`,
        order_id: orderId,
        to_email: order.attendee_email,
        to_name: order.attendee_name,
        subject: `Passes Approved: Order #${orderId}`,
        body: `Dear ${order.attendee_name},\n\nYour order #${orderId} has been approved by the EventHub administration.\n\nYour digital QR pass is now active for gate entry.`,
        sent_at: new Date().toISOString(),
        type: 'order_confirmed',
        read: false,
      };
      this.emails.unshift(confirmEmail);
      this.save(STORAGE_KEYS.EMAILS, this.emails);
    }

    return {
      success: true,
      order: this.enrichOrder(order),
    };
  }

  public getAllOrders(): EnrichedOrder[] {
    return this.orders.map((o) => this.enrichOrder(o));
  }

  public getOrdersForUser(userId: string): EnrichedOrder[] {
    const user = this.users.find((u) => u.id === userId);
    return this.orders
      .filter((o) => o.user_id === userId || (user && o.attendee_email.toLowerCase() === user.email.toLowerCase()))
      .map((o) => this.enrichOrder(o));
  }

  private enrichOrder(order: Order): EnrichedOrder {
    const user = this.users.find((u) => u.id === order.user_id);
    const eventsMap = new Map<string, Event>();
    this.events.forEach((e) => eventsMap.set(e.id, e));
    const categoriesMap = new Map<string, string>();
    this.categories.forEach((c) => categoriesMap.set(c.id, c.name));

    const rawItems = this.order_items.filter((oi) => oi.order_id === order.id);
    const enrichedItems: EnrichedOrderItem[] = rawItems.map((item) => {
      const evt = eventsMap.get(item.event_id);
      return {
        ...item,
        eventTitle: evt?.title || 'Event',
        eventDate: evt?.event_date || '',
        eventVenue: evt?.venue || 'Venue Location',
        eventPoster: evt?.poster || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        categoryName: evt ? categoriesMap.get(evt.category_id) || 'General' : 'General',
      };
    });

    return {
      ...order,
      userName: user?.name || order.attendee_name,
      userEmail: user?.email || order.attendee_email,
      items: enrichedItems,
    };
  }

  // --- Emails ---
  public getEmails(): SimulatedEmail[] {
    return [...this.emails];
  }

  public markEmailAsRead(id: string): void {
    const email = this.emails.find((e) => e.id === id);
    if (email) {
      email.read = true;
      this.save(STORAGE_KEYS.EMAILS, this.emails);
    }
  }

  // --- Admin Metrics ---
  public getDashboardMetrics() {
    const confirmedOrders = this.orders.filter((o) => o.status === 'confirmed');
    const pendingOrders = this.orders.filter((o) => o.status === 'pending');
    const cancelledOrders = this.orders.filter((o) => o.status === 'cancelled');

    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total_amount, 0);

    const totalTicketsSold = this.order_items
      .filter((oi) => {
        const order = this.orders.find((o) => o.id === oi.order_id);
        return order && order.status === 'confirmed';
      })
      .reduce((sum, oi) => sum + oi.quantity, 0);

    const totalSeatsCapacity = this.events.reduce((sum, e) => sum + e.total_seats, 0);
    const totalSeatsRemaining = this.events.reduce((sum, e) => sum + e.seats_available, 0);

    return {
      totalRevenue, // in PKR
      totalTicketsSold,
      pendingOrdersCount: pendingOrders.length,
      confirmedOrdersCount: confirmedOrders.length,
      cancelledOrdersCount: cancelledOrders.length,
      totalSeatsCapacity,
      totalSeatsRemaining,
    };
  }
}

export const db = new DatabaseService();
