# Pretty Threads E-Commerce Website (Full-Stack)

A premium, conversion-focused, and modern full-stack e-commerce web application built for the apparel brand **Pretty Threads**. This project features streetwear and elevated traditional fashion collections utilizing original high-resolution design photography.

---

## 🚀 Features Implemented
1. **Interactive Storefront Pages**:
   - **Home**: Beautiful asymmetric hero collage, press logos strip, trust/stat marketing banner, best-sellers carousel, loyalty club membership tiers (Bronze, Perks, VIP), and customer reviews.
   - **Shop/Catalog**: Searchable product grid with interactive sidebar filters (Category, Sizing, Color, and Price range slider) and simulated 450ms skeleton loader transitions.
   - **Product Detail (PDP)**: Detail layout with color/size swatches, native details accordion disclosures (`<details>` / `<summary>`), live stock indicators, reviews listings, and dynamic review submission form.
   - **Shopping Cart**: slide-out animated Cart Drawer with line quantity modifiers, subtotal calculators, and slide-in entry points.
   - **Checkout**: Multi-step checkout form (Contact information, courier delivery address, and simulated Stripe Elements card inputs) supporting coupon overrides (e.g. `PRETTY10` for 10% off) and a transaction confirmation panel.
   - **Customer Account Dashboard**: Lists order logs with live shipping delivery updates (`PAID`, `SHIPPED`, `DELIVERED`), saved courier address blocks, settings form, and wishlist items.
   - **Admin Portal**: Displays key stats (Sales Revenue, Order Counts, Inventory Audits, Low Stock alerts), Order moderation (updating status, simulated printing/refunds), live stock adjustments with direct database synchronization, reviews moderation, and conversions funnel analytics.

2. **Backend Services & DB Layer**:
   - **Simulated Stripe checkout API**: verifies stock availability, logs transactions, and decrements variant stock directly.
   - **ORM Database schema**: SQLite & Prisma schema config located in `prisma/schema.prisma`.
   - **Persistent Local DB file**: Data persistent at `src/data/db.json` managed via `src/lib/db.ts` to allow 0-friction local execution.

---

## 🛠️ Technology Stack
- **Framework**: React (Next.js 16, App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (configured via CSS variables & theme rules in `globals.css`)
- **State Management**: Zustand (persists shopping bag, wishlist, and session local storage)
- **Animations**: Framer Motion (subtle drawers slides and route fades)
- **Icons**: Lucide React

---

## 📂 Project Folder Structure
```bash
├── prisma/
│   └── schema.prisma      # DB Schema Contract (Postgres/SQLite reference)
├── public/
│   └── images/            # Pretty Threads fashion photography assets
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── api/           # Backend JSON APIs (products, checkout, orders, reviews)
│   │   ├── shop/          # Interactive Shop catalog page
│   │   ├── product/[slug] # Product Detail Page (PDP)
│   │   ├── checkout/      # Multi-step checkout and confirmation page
│   │   ├── account/       # Customer dashboard (orders, addresses, wishlist)
│   │   ├── admin/         # Admin portal (metrics, stock audits, refunds)
│   │   ├── layout.tsx     # Base document and web safe system fonts
│   │   └── page.tsx       # Homepage layout
│   ├── components/        # Shared components (Header, Footer)
│   │   └── ui/            # UI components (NotchedDivider, StatBanner)
│   ├── data/
│   │   └── db.json        # Pre-seeded local persistent JSON database
│   ├── lib/
│   │   └── db.ts          # Asynchronous database accessor layer (CRUD)
│   └── store/
│       └── useStore.ts    # Zustand global cart and wishlist client store
```

---

## 💻 How to Run Locally

### 1. Install Dependencies
Run the package installations:
```bash
npm install
```

### 2. Run the Development Server
Launch the local Turbopack development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Code Integrity & Compilation
Compile and build the production bundle:
```bash
npm run build
```

---

## ⚙️ Swapping in Live Production Keys & DB

### 1. Swapping SQLite to PostgreSQL in Prisma
Currently, the schema runs locally with zero setup on a mock JSON database accessor to prevent connection friction. To switch to PostgreSQL via Prisma ORM:
1. Update `prisma/schema.prisma` datasource block:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/prettythreads?schema=public"
   ```
3. Generate Prisma client & push database contract:
   ```bash
   npx prisma db push
   ```
4. Replace the operations inside `src/lib/db.ts` to call Prisma ORM methods (e.g. `prisma.product.findMany()`) instead of reading from `db.json`.

### 2. Adding Live Stripe Payments
Currently, the checkout route `/api/checkout` simulates Stripe transaction approvals. To connect live Stripe payments:
1. Install Stripe server package:
   ```bash
   npm install stripe
   ```
2. Add keys to your `.env` file:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
3. Update `src/app/api/checkout/route.ts` to create a real Stripe payment intent:
   ```typescript
   import Stripe from 'stripe';
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   
   const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.round(total * 100), // in cents
     currency: 'usd',
     payment_method_types: ['card'],
   });
   ```
4. Embed the `@stripe/react-stripe-js` `<Elements>` provider on the `src/app/checkout/page.tsx` client checkout page to render live card inputs.
