---
name: Kinetic Horizon
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  surface-canvas: '#F8FAFC'
  surface-card: '#FFFFFF'
  surface-subtle: '#F1F5F9'
  border-subtle: '#E2E8F0'
  border-strong: '#CBD5E1'
  text-primary: '#0F172A'
  text-secondary: '#64748B'
  text-muted: '#94A3B8'
  status-pending-bg: '#FEF3C7'
  status-pending-text: '#B45309'
  status-confirmed-bg: '#DCFCE7'
  status-confirmed-text: '#15803D'
  status-cancelled-bg: '#FEE2E2'
  status-cancelled-text: '#B91C1C'
  urgency-coral: '#F43F5E'
  live-emerald: '#10B981'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, contemporary aesthetic tailored for experiential ticketing, real-time seat inventory, and operational administration. The visual tone bridges consumer discovery—vibrant, atmospheric, and frictionless—with administrative precision—structured, dense, and unambiguous.

The visual style blends **Corporate Modern** rigor with **Tactile Glass and Ambient Depth**:
- **Structured Precision**: High-density data tables, sharp information hierarchy, and clean metric cards create instant confidence during mission-critical tasks like inventory adjustments and order validation.
- **Atmospheric Vitality**: Electric Indigo and deep violet accents cut through clean slate backgrounds to produce an energetic, premier event atmosphere without introducing visual clutter.
- **Clarity and Immediacy**: Micro-interactions, soft physical outlines, and high-visibility status tokens convey immediate clarity across rapid seat reservation timers, live availability states, and multi-tier transactional checkouts.

## Colors

The color system delivers high legibility and precise visual cues across dense transactional tables and immersive event listings.

### Palette Hierarchy & Semantics
- **Primary (`#4F46E5` - Electric Indigo)**: Applied to core actions, active navigation states, interactive buttons, and high-emphasis focus rings.
- **Secondary (`#6366F1` - Vibrant Violet)**: Applied to secondary focus accents, gradient stops for hero banners, selected ticket tiers, and category tags.
- **Tertiary (`#F59E0B` - Warm Amber)**: Reserved strictly for urgency indicators, low-stock ticket alerts, warning notifications, and `Pending` state chips.
- **Neutral (`#0F172A` - Deep Slate)**: Used for primary typography, crisp contrast iconography, and high-emphasis surfaces.

### Semantic Status Tokens
- **Pending**: Soft amber background (`#FEF3C7`) with deep amber text (`#B45309`).
- **Confirmed**: Fresh emerald background (`#DCFCE7`) with deep forest green text (`#15803D`).
- **Cancelled / Critical**: Soft rose background (`#FEE2E2`) with dark crimson text (`#B91C1C`).
- **Urgency / Live Seats**: Coral (`#F43F5E`) and Live Emerald (`#10B981`) pulse badges indicate checkout countdown limits and active seat inventory replenishment.

## Typography

The typographic system pairs the geometry and warmth of **Plus Jakarta Sans** for headers with the micro-legibility of **Inter** for dense booking tables, transactional details, and forms.

- **Display & Headlines**: Built using Plus Jakarta Sans with negative tracking (`-0.02em` to `-0.03em`) to anchor event titles and promotional headers with a clean, editorial presence.
- **Body & Data Tables**: Inter handles extended descriptions, attribute metadata, pricing breakdowns, and checkout steps. Its tall x-height preserves readability in compact form fields and data grids.
- **Labels & Microcopy**: Status badges, table column headers, and countdown meters rely on medium-to-bold weights with slight letter-spacing expansion (`0.02em` to `0.04em`) to ensure legibility in tight spatial envelopes.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid, utilizing a base 4px/8px incremental spacing rhythm.

### Grid & Breakpoints
- **Mobile (< 768px)**: 4-column layout with `1rem` margins and `1rem` gutters. Admin data tables reflow into vertically stacked card rows. Cart and checkout bars anchor persistently to the bottom viewport.
- **Tablet (768px - 1024px)**: 8-column layout with `1.5rem` margins and `1.5rem` gutters. Filter bars collapse into an off-canvas drawer.
- **Desktop (1024px+)**: 12-column layout with max-width content constraints of `1280px` (Public Catalogue) and `1440px` (Admin Console), anchored by `2rem` margins and `1.5rem` gutters.

### Spacing Tokens
- `space-xs` (4px): Micro-spacing between icons and label copy, inline badge padding.
- `space-sm` (8px): Form input inner vertical padding, gap between metadata tags.
- `space-md` (16px): Standard gap between form fields, list item padding, and card inner padding for compact views.
- `space-lg` (24px): Standard card container padding, distance between related component groups.
- `space-xl` (40px): Section separation within administrative dashboards and checkout layouts.

## Elevation & Depth

Visual hierarchy uses subtle ambient shadows paired with crisp border outlines (`#E2E8F0`). This ensures elements remain distinct on both crisp white backgrounds and soft canvas foundations.

### Elevation Levels
- **Level 0 (Flat / Canvas)**: `#F8FAFC` background. Used for page-level canvasing and inactive table rows.
- **Level 1 (Cards & Data Cells)**: White surface (`#FFFFFF`) with a 1px solid border (`#E2E8F0`) and ambient shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05)`. Used for event cards, standard metric counters, and input containers.
- **Level 2 (Interactive Hover & Flyouts)**: 1px border (`#CBD5E1`) with elevated shadow `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`. Applied to hovered event posters, dropdown menus, filter popovers, and sticky checkout summaries.
- **Level 3 (Modals & Overlays)**: Shadow `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` over a frosted backdrop (`rgba(15, 23, 42, 0.4)` with 4px blur). Applied to ticket order confirmation dialogs, seat-map details, and image upload review modals.

## Shapes

The design system employs a **Rounded** shape language (`roundedness: 2`, base radius `0.5rem` / 8px). This softens administrative forms without compromising the compact alignment needed for transactional data grids.

- **Base Components (Inputs, Buttons, Dropdowns)**: `0.5rem` (8px) corner radius.
- **Cards & Containers (`rounded-lg`)**: `1rem` (16px) corner radius for event catalogue posters, modal containers, and dashboard panels.
- **Pills & Status Badges (`rounded-full`)**: Complete rounding (`9999px`) for order status pills (`Pending`, `Confirmed`, `Cancelled`), inventory chips, and category filter pills.

## Components

### Buttons
- **Primary**: Solid Electric Indigo (`#4F46E5`), text white, `0.5rem` radius, bold weight (`label-lg`), subtle shadow. Hover transitions to `#4338CA`. Active states scale down to `0.98`.
- **Secondary**: Surface white (`#FFFFFF`) with `#E2E8F0` border, text `#0F172A`. Hover transitions background to `#F8FAFC` and border to `#CBD5E1`.
- **Destructive**: Rose background (`#FEE2E2`), text `#B91C1C`. Hover shifts to `#F87171` background with white text. Used for booking cancellations and category deletion.
- **Sizes**: Small (`32px` height, `12px` font) for table row actions; Medium (`40px` height, `14px` font) for default controls; Large (`48px` height, `16px` font) for checkout conversions.

### Input Fields & Selectors
- **Default State**: Surface `#FFFFFF`, border `1px solid #E2E8F0`, padding `0.625rem 0.875rem`, text `#0F172A`, placeholder `#94A3B8`.
- **Focus State**: Border `#4F46E5`, outline ring `3px rgba(79, 70, 229, 0.15)`.
- **Error State**: Border `#F43F5E`, error message in `#B91C1C` using `body-sm`.

### Status Badges & Chips
- **Geometry**: Compact height (`22px`), `rounded-full` pill geometry, horizontal padding `8px`, font `label-sm` with uppercase tracking.
- **Variants**:
  - `Pending`: Amber soft background (`#FEF3C7`), text `#B45309`, optional pulsing dot.
  - `Confirmed`: Emerald soft background (`#DCFCE7`), text `#15803D`.
  - `Cancelled`: Rose soft background (`#FEE2E2`), text `#B91C1C`.
  - `Category`: Slate subtle surface (`#F1F5F9`), text `#475569`, interactive on click.

### Event & Inventory Cards
- **Catalogue Card**: Container with white surface, `1rem` radius, `1px solid #E2E8F0`. Features a 16:9 poster display with an overlaid date badge, clear title hierarchy (`headline-sm`), venue icon row, remaining seat badge (`Live Seats: 14`), and sticky bottom action row.
- **Admin Metric Card**: Padding `1.5rem`, featuring a muted label (`label-md`), large primary metric (`headline-lg`), and an inline trend badge.

### Data Tables (Bookings & Categories)
- **Header**: Slate subtle background (`#F8FAFC`), uppercase text (`label-sm`), `#64748B`, height `40px`, bottom border `1px solid #E2E8F0`.
- **Rows**: Alternating hover fill (`#F8FAFC`), vertical alignment centered, height `56px`, cell padding `0.75rem 1rem`. Includes inline actions (View Details, Confirm, Cancel).

### Additional System Components
- **Cart Drawer / Sticky Bar**: Persistent fixed checkout bar showing item quantity, remaining expiration timer (e.g., "Tickets reserved for 09:45"), subtotal, and direct primary checkout action.
- **Seat Gauge**: Horizontal progress meter displaying available vs. total capacity, transitioning dynamically from emerald (available) to amber (low stock) and rose (sold out).