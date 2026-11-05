export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  phone?: string;
  city?: string;
  membership_tier?: 'standard' | 'vip' | 'corporate';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Attribute {
  id: string;
  name: 'city' | 'language' | 'age_limit' | 'duration' | string;
}

export interface EventAttribute {
  event_id: string;
  attribute_id: string;
  value: string;
}

export interface Event {
  id: string;
  category_id: string;
  title: string;
  description: string;
  poster: string;
  event_date: string; // ISO date string or YYYY-MM-DD HH:MM
  venue: string;
  price: number; // In PKR (Pakistani Rupees)
  seats_available: number;
  total_seats: number;
  featured?: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  payment_method: 'easypaisa' | 'jazzcash' | 'raast_1link' | 'card' | 'bank_transfer' | 'pay_at_venue' | string;
  status: OrderStatus;
  total_amount: number; // In PKR
  created_at: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  event_id: string;
  quantity: number;
  price: number;
  seat_numbers: string[];
}

export interface SimulatedEmail {
  id: string;
  order_id: string;
  to_email: string;
  to_name: string;
  subject: string;
  body: string;
  sent_at: string;
  type: 'order_pending' | 'order_confirmed' | 'order_cancelled';
  read: boolean;
}

export interface CartItem {
  eventId: string;
  quantity: number;
  seatNumbers: string[];
}

export interface FilterOptions {
  search: string;
  categoryId: string;
  city: string;
  language: string;
  ageLimit: string;
  maxPrice: number;
  sortBy: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
}

export interface EnrichedEvent extends Event {
  categoryName: string;
  attributes: Record<string, string>;
}

export interface EnrichedOrderItem extends OrderItem {
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventPoster: string;
  categoryName: string;
}

export interface EnrichedOrder extends Order {
  userName: string;
  userEmail: string;
  items: EnrichedOrderItem[];
}
