# ✈️ Source Asia — Flight Management App

> A production-ready Progressive Web Application for searching, booking, and managing flights in real-time — built for the Source Asia Internship Technical Assignment.

**🔴 Live Demo:** Replace with your Vercel URL after deployment.
**📁 Repository:** [github.com/pran-ekaiva006/flight-management-app](https://github.com/pran-ekaiva006/flight-management-app)

---

## 📖 Summary

A full-stack flight booking system built with **Next.js 14 (App Router)**, **Supabase (PostgreSQL + Realtime)**, **Zustand**, and **Tailwind CSS**. Key features include:

- 🔒 Transactional seat locking to prevent double-booking (race condition safe)
- ⚡ Real-time seat map updates via Supabase WebSockets
- 📱 Fully installable PWA with offline support
- 🗃️ Zustand state persistence across page refreshes mid-booking

---

## 📸 Screenshots

| Landing / Dashboard | Search Flights |
|:---:|:---:|
| ![Landing](docs/screenshots/landing.png) | ![Search](docs/screenshots/search-flights.png) |

| Select Your Seat | Passenger Details |
|:---:|:---:|
| ![Seat Map](docs/screenshots/select-seat.png) | ![Passenger](docs/screenshots/passenger-details.png) |

| Booking Confirmed |
|:---:|
| ![Confirmation](docs/screenshots/booking-confirmed.png) |

---

## 🧪 Test Credentials

| Field | Value |
|---|---|
| Email | `pranjalverma975@gmail.com` |
| Password | Your registered password |

> To add your own test user, run `supabase/seed.sql` in the Supabase SQL editor.

---

## 🏗️ Architecture

```
Next.js 14 (App Router)
├── Server Components  → Data fetching (flights, bookings)
├── Client Components  → Seat map, forms, realtime UI
├── Server Actions     → create/cancel/reschedule bookings
└── Middleware         → Auth session refresh on every request

Supabase
├── PostgreSQL         → flights, seats, bookings, passengers, reschedules
├── Auth               → Email/password with SSR session management
├── Realtime           → Live seat availability via WebSocket channels
└── RLS Policies       → Users can only read/write their own bookings

Zustand
├── flight-store       → Search query, selected flight/seat, booking step
└── user-store         → Session token (persisted), bookings cache (transient)
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account

### 1. Clone & Install
```bash
git clone https://github.com/pran-ekaiva006/flight-management-app.git
cd flight-management-app
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup
1. Go to your **Supabase Dashboard → SQL Editor**
2. Run the migration files in order from `supabase/migrations/`:
   - `00001_create_core_schema.sql`
   - `00002_enhance_rls_policies.sql`
   - `00003_enhanced_seat_locking_rpc.sql`
   - `00004_reschedule_booking_rpc.sql`
3. *(Optional)* Run `supabase/seed.sql` to insert sample flights and a test user
4. Go to **Authentication → Providers → Email** and **disable "Confirm email"** for instant logins

### 4. Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add the three environment variables from `.env.example`
4. Click **Deploy**

---

## 🔑 Technical Decisions

### Race-Condition-Safe Booking
The `reserve_seat` RPC uses `SELECT ... FOR UPDATE` to row-lock the seat inside a single transaction. Any concurrent request for the same seat will block, then fail gracefully with a `SEAT_TAKEN` error — preventing double-bookings at the database level.

### Zustand + Persistence
- `flight-store` persists search query, selected flight, and seat to `localStorage` so users can refresh mid-booking without losing context.
- `partialize` intentionally **excludes** `passportNo` and sensitive passenger data from persistence.

### Supabase Realtime
The seat map subscribes to a filtered WebSocket channel (`seats:flight_id=eq.<id>`). When any user books a seat, all other viewers see it flip to "Occupied" in real-time without refreshing.

### PWA + Offline
Configured with `@ducanh2912/next-pwa`. Uses `StaleWhileRevalidate` for bookings and search results. An `/offline` fallback page is served for un-cached routes when the user is offline.

---

## ⚖️ Tradeoffs

| Decision | Chosen | Alternative | Reason |
|---|---|---|---|
| Seat locking | `SELECT FOR UPDATE` | Serializable isolation | Less lock contention, targeted locking |
| Realtime scope | Seats only | All tables | Flights change rarely; seat contention is real-time critical |
| Business rules | DB triggers | Application layer | Guarantees 2-hour cancellation rule even if API is bypassed |
| Payment | Not included | Stripe / Razorpay | Out of scope for assignment; would need a pending-booking state + webhook |

---

*Built by Pranjal Kumar Verma — Source Asia Internship Assignment 2026*
