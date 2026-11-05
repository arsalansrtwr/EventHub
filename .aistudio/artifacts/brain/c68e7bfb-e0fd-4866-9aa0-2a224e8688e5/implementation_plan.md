# EventHub — Modern Event Discovery & Ticket Booking Platform

A comprehensive, production-grade event ticketing platform and administration suite delivering seamless event discovery, smart multi-attribute filtering, interactive seat selection, cart/checkout with simulated payments, customer account portal with digital QR tickets, and a full administrative control panel with live seat inventory control, category & event management, poster upload simulation, and transactional email notification delivery.

### User Review & Critical Decisions

> [!IMPORTANT]
> The design and scope requirements confirmed in Phase 1 have been directly synthesized into the core specification:
> - **Visual Direction**: Clean, light minimalist ticketing platform aesthetic with refined typography (`Plus Jakarta Sans` display & `Public Sans` body), quiet hairline borders, zero-pill metadata discipline, and generous whitespace.
> - **Authentication & Roles**: Standard login and registration forms with validation, session tokens, password hashing emulation, and quick-fill test credentials (`Customer` & `Administrator`) for seamless evaluation.
> - **Feature Scope**: Complete customer journey (catalogue, search, multi-faceted filtering, interactive seat map selector, cart, checkout) + Admin panel (category CRUD, event CRUD with poster upload, live seat inventory replenishment upon cancellation, order review with approve/cancel actions) + Simulated email notification drawer & downloadable/printable QR ticket passes.

- **Confirmed Decision 1**: Clean light minimalist modern aesthetic with indigo/slate accents, high-contrast readable typography, and strict 60-30-10 color allocation.
- **Confirmed Decision 2**: Dual-role operational model (Customer & Admin) with real credentials auth, session persistence in localStorage with cookies emulation, and 1-click test credentials.
- **Confirmed Decision 3**: Complete realization of all PDF requirements + Advanced capabilities: Interactive visual seat map, QR code pass generation, order confirmation/cancellation lifecycle with seat return, and simulated customer email dispatch center.

---

### 1. Overview & Core Concept

- **What It Does**: EventHub replaces cumbersome phone/chat/paper ticketing with a streamlined digital e-service where visitors discover live events (concerts, conferences, sports, workshops), explore venues and seat maps, reserve tickets into a session cart, and checkout with attendee details. Event organizers and administrators gain centralized governance to manage event categories, schedule events, configure pricing and seat allocations, review customer bookings, and approve or cancel orders with automated email notifications and automatic seat inventory restoration.
- **Target Audience / Persona**:
  - *Event Attendees / Customers*: Music fans, tech professionals, and students seeking instant seat booking, clear pricing, and instant QR-coded mobile passes.
  - *Platform Administrators & Organizers*: Venue coordinators needing real-time booking rosters, attendee verification, category taxonomies, and inventory replenishment.
- **Key Value**: Eliminates manual booking errors, overselling, and lost reservations through deterministic relational data consistency, real-time seat decrementing, and automated booking notifications.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Discovery & Exploration**:
   - Clean top navigation bar with brand wordmark, quick links (`Explore Events`, `Categories`, `Venues`, `My Bookings`), search affordance, and customer/admin auth status.
   - Hero spotlight featuring an upcoming headliner event with instant booking CTA and category fast-filters (`Music`, `Tech & AI`, `Design`, `Sports`, `Business`, `Workshops`).
   - Smart multi-attribute filter drawer/sidebar: Filter simultaneously by category, city venue, date range, spoken language, age limit, and price slider.
2. **Event Details & Interactive Seat Selection**:
   - Dedicated event view showing poster photography, venue address, date/time, description, category, and flexible attributes (City, Language, Age Limit, Dress Code).
   - Interactive SVG Seat Map: Visual seating grid (Front Stage, VIP Tier, Standard Tier) showing available, selected, and reserved seats with dynamic price calculation, or general admission ticket counter.
   - Quantity selector with live remaining seat counter that dynamically prevents overselling.
3. **Cart & Secure Checkout Flow**:
   - Slide-over ticket cart with itemized pricing, per-seat breakdown, quantity stepper, and timer-based hold simulation.
   - Checkout wizard: Step 1 (Primary Attendee Contact & Badge Details) $\to$ Step 2 (Payment Method Choice: Credit/Debit Card, Bank Transfer, Apple Pay / Google Pay, or Cash on Entry) $\to$ Step 3 (Instant Order Confirmation with Booking Reference `#EH-XXXXXX`).
4. **Customer Portal & Digital QR Passes**:
   - `My Bookings` dashboard tracking orders by status (`Pending`, `Confirmed`, `Cancelled`).
   - Detailed ticket modal with scannable SVG QR code pass, downloadable/printable summary ticket, and attendee badge details.
5. **Administrative Console**:
   - Executive metrics overview: Total revenue, total tickets booked, active events, and pending orders requiring review.
   - **Category Management**: Add, edit name/slug, and delete event categories with cascading safety checks.
   - **Event Management**: Create new event modal with poster upload simulation (supporting local file picker or curated presets), date/time pickers, category selector, venue, price, total seat capacity, and custom attributes (city, language, age limit).
   - **Order Review & Seat Control**: Tabular order ledger with status toggles (`Confirm Booking`, `Cancel Booking`). Cancelling an order immediately restores the reserved seats to the event's available capacity.
6. **Simulated Email Dispatch Center**:
   - Floating notification inbox simulation reflecting automated emails triggered via PHP `mail()` architecture logic (`Booking Received [Pending]`, `Booking Approved [Confirmed]`, `Booking Cancelled & Refunded`).

#### Visual Identity & Theme
- **Aesthetic Direction**: Clean, light minimalist ticketing platform aesthetic inspired by high-end design systems. Crisp off-white surfaces (`#F8FAFC`, `#FFFFFF`), subtle hairline borders (`border-slate-200`), and typography-driven visual weight.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - *60% Dominant Neutral Canvas*: Pure white (`#FFFFFF`) card surfaces over subtle zinc/slate backdrop (`#F8FAFC`).
  - *30% Structural Surfaces*: Hairline borders (`#E2E8F0`), muted labels (`#64748B`), and dark slate text headings (`#0F172A`).
  - *10% Disciplined Accent*: Electric Royal Indigo (`#4F46E5` / `#4338CA`) for primary actions, active tabs, and checkout triggers; emerald (`#16A34A`) for confirmed status; amber (`#D97706`) for pending reviews; rose (`#DC2626`) for cancellations.
- **Typography & Hierarchy**:
  - *Display / Headings*: `Plus Jakarta Sans` (font weights 600 & 700) with balanced line wraps (`text-wrap: balance`).
  - *Body Prose*: `Public Sans` / `Plus Jakarta Sans` (weight 400 & 500) with 1.6 line height.
  - *Data & Telemetry*: Monospace tabular figures (`tabular-nums font-mono`) for ticket prices, seat IDs, booking numbers, and dates.
- **Anti-Slop Restraint**: Zero pill badge sandwiches on cards; metadata displayed cleanly with typographic middle dot separators (`Music · London · 18+ · $45.00`); no arbitrary AI scoreboards or decorative status dots.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Relational Database Architecture in TypeScript (Mirroring MySQL Schema)**:
  - *Chosen Approach*: Implement a structured, relational in-memory / localStorage database engine that mirrors the MySQL schema documented in Slide 9 (`users`, `orders`, `order_items`, `events`, `categories`, `attributes`, `event_attributes`) with foreign key relational joins and transactional integrity.
  - *Why*: Perfectly fulfills the course project requirements for SQL table joins, prepared statement semantics, and relational queries while ensuring instant client-side responsiveness and zero flaky backend setup.
  - *Alternatives Considered*: Cloud SQL or SQLite was considered, but client-side relational storage provides 100% offline reliability, instant seed demo resets, and zero cold starts while preserving identical SQL schema semantics.
- **Decision 2: Interactive SVG Seat Map + Tier Selection**:
  - *Chosen Approach*: Provide an interactive visual theater/venue seating grid alongside a fast quantity stepper.
  - *Why*: Elevates the platform from a generic store to an authentic, professional ticketing system matching modern industry standards.
- **Decision 3: Dual-Role Authentication with One-Click Quick Fill**:
  - *Chosen Approach*: Support full registration and login forms with field validations and password hashing emulation, while embedding a discreet test credentials helper (`Quick-Fill Customer` / `Quick-Fill Admin`).
  - *Why*: Meets strict rubric criteria for registration, login, and access control while ensuring reviewers can evaluate all flows in seconds without typing mock emails.
- **Decision 4: Real-time Seat Allocation & Cancellation Reversion**:
  - *Chosen Approach*: Booking an order atomically decrements `seats_available`. If an admin or user cancels the order, the exact quantity of seats is atomically restored back to the event.
  - *Why*: Directly satisfies the core business logic rule highlighted on Slide 6 & 8 of the project specifications.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EventHub Application Layout                     │
├────────────────────────────────────────────────────────────────────────┤
│  [TopBar] Brand Wordmark · Explore · Categories · Orders · Auth State  │
├──────────────────────────────────────┬─────────────────────────────────┤
│          Customer View               │         Admin Console           │
│  - Hero Headliner & Quick Search     │  - Real-Time KPI Stats          │
│  - Category Tabs & Smart Filter Bar  │  - Category Manager (CRUD)      │
│  - Event Catalog (Cards & Details)   │  - Event Manager (Create/Edit)  │
│  - Interactive Seat Map Modal        │  - Poster Upload Simulation     │
│  - Slide-Over Ticket Cart            │  - Order Ledger (Confirm/Cancel)│
│  - Multi-Step Checkout Modal         │  - Seat Reversion Engine        │
│  - "My Bookings" with QR Passes      │  - Customer Email Outbox Log    │
├──────────────────────────────────────┴─────────────────────────────────┤
│  [Simulated Email Notification Drawer] Real-time Booking Status Emails │
├────────────────────────────────────────────────────────────────────────┤
│                 Relational Data Engine (MySQL Emulation)               │
│    users ──< orders ──< order_items >── events >── categories          │
│                                           │                            │
│                                           └──< event_attributes >──    │
│                                                    attributes          │
└────────────────────────────────────────────────────────────────────────┘
```

#### Relational Data Model (Matching Slide 9 Schema)
1. `users`: `id`, `name`, `email`, `password_hash`, `role` (`'customer' | 'admin'`), `created_at`
2. `categories`: `id`, `name`, `slug`, `icon`
3. `events`: `id`, `category_id` (FK), `title`, `description`, `poster`, `event_date`, `venue`, `price`, `seats_available`, `total_seats`
4. `attributes`: `id`, `name` (`'city'`, `'language'`, `'age_limit'`, `'duration'`)
5. `event_attributes`: `event_id` (FK), `attribute_id` (FK), `value`
6. `orders`: `id`, `user_id` (FK), `attendee_name`, `attendee_email`, `attendee_phone`, `payment_method`, `status` (`'pending' | 'confirmed' | 'cancelled'`), `total_amount`, `created_at`
7. `order_items`: `id`, `order_id` (FK), `event_id` (FK), `quantity`, `price`, `seat_numbers` (array)
8. `simulated_emails`: `id`, `to_email`, `subject`, `template_type`, `order_id`, `body`, `sent_at`, `read`

#### Interactive Component & State Mapping
- `Search & Smart Filter Bar`: Debounced search string, category chip filter, city dropdown, price slider, and language filter generating combined relational queries.
- `Cart State`: Global reactive cart store supporting add, remove, quantity update, seat reservations, and subtotal calculation with fees transparency.
- `Order Lifecycle State Transitions`:
  - `Submit Order`: `seats_available = seats_available - qty`, create `order` (`status: 'pending'`), create `order_items`, emit `Booking Received` email.
  - `Admin Confirm`: Update `order.status = 'confirmed'`, emit `Booking Confirmed` email with QR ticket.
  - `Admin/User Cancel`: Update `order.status = 'cancelled'`, `seats_available = seats_available + qty`, emit `Booking Cancelled & Refunded` email.
