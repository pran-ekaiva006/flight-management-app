# ✈️ Source Asia Flight Management App

![Flight App Banner](https://via.placeholder.com/1200x400/111827/FFFFFF?text=Source+Asia+Flight+Management)

> A modern, highly-performant, and production-ready Progressive Web Application (PWA) for searching, booking, and managing flights in real-time.

**[🔴 Live Demo (Vercel)](https://flight-management-app.vercel.app)**  
*(Note: Replace with actual deployed URL)*

---

## 📖 Summary

The **Source Asia Flight Management App** is a full-stack Next.js application designed to provide users with a seamless, airline-grade booking experience. It features real-time seat availability syncing, transactional seat locking to prevent double-booking, and complete offline PWA capabilities. Built with Next.js 14 (App Router), Supabase (PostgreSQL), Tailwind CSS, and Zustand, this application represents a scalable, cloud-native architecture.

---

## 🧪 Test User Credentials

To quickly evaluate the dashboard, bookings, and cancellation workflows without signing up, use the seeded test user:
- **Email:** `test@example.com`
- **Password:** `password123`

*(Note: Test user is created via the Supabase Auth Dashboard or `supabase/seed.sql`)*

---

## 📸 Screenshots & PWA Audit

| Flight Search & Discovery | Realtime Seat Map |
| :---: | :---: |
| ![Search](https://via.placeholder.com/500x300/111827/FFFFFF?text=Flight+Search) | ![Seat Map](https://via.placeholder.com/500x300/111827/FFFFFF?text=Interactive+Seat+Map) |
| **Lighthouse PWA Score (100)** | **PWA Offline Mode** |
| ![Lighthouse](https://via.placeholder.com/500x300/111827/FFFFFF?text=Lighthouse+PWA+Score+100) | ![Offline](https://via.placeholder.com/500x300/111827/FFFFFF?text=Offline+Support) |

---

## 🏗️ Architecture Overview

The application utilizes a decoupled, modern architecture:

- **Frontend:** Next.js 14 (App Router), React, and Tailwind CSS.
- **State Management:** Zustand (with LocalStorage persistence).
- **Backend/Database:** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (SSR configured).
- **Realtime:** Supabase Realtime (WebSockets).
- **Offline Support:** Next-PWA (Service Workers).

### Application Flow
1. **Search:** Users search for flights. Data is fetched concurrently on the server.
2. **Select:** Users browse the **Real-Time Seat Map**, which is subscribed to a WebSocket channel. If another user books a seat, it instantly updates to "Occupied".
3. **Checkout:** Passenger details are managed in a globally persisted `Zustand` store, allowing users to safely refresh mid-booking.
4. **Transaction:** The booking action triggers a hardened PL/pgSQL RPC function (`reserve_seat`) on the database, which uses Advisory Locks (`pg_advisory_xact_lock`) to atomically verify seat availability, lock it, and generate a PNR.
5. **Confirmation:** The user receives a confirmed ticket they can immediately print.

---

## 🧠 Zustand Store Structure

To manage complex multi-step booking flows, we designed a well-structured **Zustand store** (`useFlightStore`).

### Structure and Persistence
- **State Segments:** The store maintains the `active search query`, `selected flight`, `selected seat`, `current booking step`, and `passenger form data`.
- **`persist` Middleware:** We wrap the store in `persist` to automatically save the user's booking progress to `localStorage`. If the user accidentally closes the tab or refreshes, they can resume exactly where they left off.
- **`partialize` for Security:** We use the `partialize` configuration in the persist middleware to strictly **exclude sensitive fields** (like passport numbers and nationality) from being saved to `localStorage`. Only non-sensitive data (like the selected flight ID and basic search query) is persisted.
- **Optimistic Updates:** When a user selects a seat, we aggressively update the store to mark it as selected *before* the Supabase write confirms, ensuring a snappy UI.
- **Store Reset:** A `resetStore` action is dispatched upon successful booking, cancellation, or user logout to ensure no stale data leaks between sessions.

---

## ⚡ Progressive Web App (PWA)

Configured using `@ducanh2912/next-pwa`, the app is fully installable on desktop and mobile. 
- **Valid Manifest:** `manifest.json` configured with `display: standalone`, theme colors, and varied icon sizes (192x192, 512x512).
- **Offline Cache Strategies:** 
  - `StaleWhileRevalidate` for flight search results and "My Bookings" data.
  - `CacheFirst` for static assets (fonts, icons).
- **Offline Fallback:** If there is no connectivity and a route isn't cached, a beautiful `/offline` fallback page is rendered.
- **My Bookings Offline:** Thanks to the caching strategy, users can open the app in Airplane mode and still view their confirmed tickets and PNRs.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A [Supabase](https://supabase.com/) account.

### 1. Clone the repository
```bash
git clone https://github.com/pran-ekaiva006/flight-management-app.git
cd flight-management-app
```

### 2. Environment Variables (.env)
Copy the `.env.example` file to create a `.env.local` file:
```bash
cp .env.example .env.local
```
Fill in your Supabase details:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Supabase Database Setup
1. Create a new project in Supabase.
2. Navigate to the SQL Editor in your Supabase Dashboard.
3. Execute the SQL scripts found in `supabase/migrations/` in order (or run them via Supabase CLI). This will:
   - Create tables (`users`, `flights`, `seats`, `bookings`, `reschedules`).
   - Enable **Row Level Security (RLS)** ensuring users only see their own bookings.
   - Enforce DB-level triggers (e.g., blocking cancellations within 2 hours of departure).
   - Create the atomic RPC functions (`reserve_seat`, `reschedule_booking`).
   - Seed the database with 8 flights and full seat maps.
4. **Important:** Go to **Authentication > Providers > Email** and turn **OFF** `Confirm email` to allow instant logins for the test user.
5. *(Optional)* Run the seed script to create the test user account.

### 4. Install Dependencies & Run
```bash
npm install
npm run dev
```
The application will be running at `http://localhost:3000`.

---

## 🚢 Deployment Instructions

This app is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Add the following **Environment Variables** in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Vercel will automatically detect the Next.js framework and configure the build settings.

---

## ⚖️ Tradeoffs & Future Improvements

While this architecture is robust, several design tradeoffs were made:

1. **Advisory Locks over Serializable Transactions:** 
   To prevent double-booking race conditions, we used PostgreSQL Advisory Locks (`pg_advisory_xact_lock`) on the seat ID instead of strict `SERIALIZABLE` transaction isolation. This provides massive performance benefits and prevents lock-contention rollbacks, but requires all code modifying seats to strictly respect the advisory lock pattern.
2. **Polling vs. WebSockets for Flights:** 
   While *Seats* use WebSockets for real-time updates (via `Supabase Realtime`), *Flights* (search results) are fetched via traditional Server Components. This is a tradeoff to optimize server load; flight schedules change rarely, whereas seat availability changes constantly.
3. **Database Triggers vs Application Logic:**
   The 2-hour cancellation rule is enforced directly via a Postgres Trigger to guarantee data integrity, preventing any API endpoint bypass. However, this means business logic is split between Next.js and Postgres.

---

*Designed and engineered for speed, resilience, and user experience.*
