# DiscoverHEX — Complete Solution Documentation

> **Version:** 1.0.0 MVP  
> **Date:** June 13, 2026  
> **Repository:** https://github.com/Harikrhari/DiscoverHEX  
> **Branch:** `claude/discoverhex-marketplace-plan-5sne3v`  
> **Total Files:** 72 source files across web, mobile, backend, docs, and CI/CD

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Brand Identity](#2-brand-identity)
3. [Business Model](#3-business-model)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Web App — Page by Page](#6-web-app--page-by-page)
7. [Mobile App — Screen by Screen](#7-mobile-app--screen-by-screen)
8. [Backend — Function by Function](#8-backend--function-by-function)
9. [Key Integrations](#9-key-integrations)
10. [Environment Variables](#10-environment-variables)
11. [Step-by-Step Setup Guide](#11-step-by-step-setup-guide)
12. [Deployment Guide](#12-deployment-guide)
13. [User Flow Diagrams](#13-user-flow-diagrams)
14. [Database Schema](#14-database-schema)
15. [API Reference](#15-api-reference)
16. [File Index](#16-file-index)

---

## 1. Project Overview

**DiscoverHEX** is a multi-category premium marketplace combining four revenue-generating pillars into one unified platform:

| Pillar | What It Does | Revenue |
|--------|-------------|---------|
| **Marketplace** | Sells premium-positioned products across 5 categories | Product margin |
| **Sponsor Zone** | Brands pay to sponsor products and earn visibility | Monthly sponsor fees |
| **Creator Marketplace** | Influencers promote products and earn commission | Platform fee on commissions |
| **Charity Engine** | 5–10% of every sale goes to verified causes with full transparency | Donor trust → more sales |
| **Crowdfunding** | Community investors buy in at $100–$50K tiers | Investment capital |

**5 Product Categories:**
- Sports & Fitness
- Health & Wellness
- Outdoor & Adventure
- AI & Smart Gadgets
- Premium Lifestyle

**3 Core Differentiators:**
1. **Virality** — social auto-posting to Instagram/YouTube/Facebook on every product drop and milestone
2. **Sponsor Appeal** — branded sponsor placement with real ROI analytics dashboard
3. **Charity Transparency** — every purchase allocation is publicly traceable, building deep customer trust

---

## 2. Brand Identity

| Element | Value |
|---------|-------|
| **Brand Name** | DiscoverHEX |
| **HEX Meaning** | Human Excellence / High Excellence / High Performance |
| **Tagline** | *Discover the Best Version of Yourself* |
| **Mission** | Make premium products accessible while creating real-world impact |

### Color Palette

| Name | Hex Code | Usage |
|------|----------|-------|
| `hex-primary` | `#FF6B35` | CTAs, active states, sports energy |
| `hex-secondary` | `#1A1A2E` | Backgrounds, nav, dark sections |
| `hex-accent` | `#E94560` | Alerts, urgent CTAs, gradient |
| `hex-gold` | `#F5A623` | Sponsor tier, premium badges |
| `hex-green` | `#27AE60` | Charity, success, sustainability |
| `hex-dark` | `#0F0F1A` | Sponsor/crowdfunding dark pages |

---

## 3. Business Model

### Revenue Streams

```
1. Product Sales
   └─ Sell premium-positioned goods at 40–60% markup
   └─ Sourced from verified China suppliers, branded as HEX products

2. Sponsor Fees
   └─ Bronze: $1,000/mo — product listing + analytics
   └─ Silver: $2,500/mo — + homepage + charity co-branding
   └─ Gold: $5,000/mo — + dedicated page + account manager

3. Creator Commissions (Platform Fee)
   └─ Nano (1K–10K followers): 8% commission
   └─ Micro (10K–100K): 10%
   └─ Macro (100K–1M): 12%
   └─ Mega (1M+): 15%
   └─ DiscoverHEX retains 20% of all creator commissions

4. Crowdfunding / Investment
   └─ Community Investor: $250 → Investor badge + 10% lifetime discount
   └─ Growth Partner: $1,000 → + early access + investor calls
   └─ Strategic: $5,000 → + 0.5% equity + advisory board
   └─ Founding: $10,000+ → + 1.2% equity + revenue sharing

5. Charity Halo Effect
   └─ 5–10% of every sale earmarked to verified causes
   └─ Full public transparency builds repeat buyer loyalty
   └─ Tax deduction benefits passed to buyers (future feature)
```

### Unit Economics (Example)

```
Product sold for:    $49.99
Cost of goods:       $18.00
Platform margin:     $31.99 (64%)

Allocation:
├─ Charity (7%):     $3.50
├─ Creator comm(10%):$5.00  → Platform keeps 20% = $1.00
├─ Sponsor margin:   $4.00
└─ Net to DiscoverHEX: ~$19.49 per unit
```

---

## 4. Tech Stack

### Why This Stack?

| Choice | Reason |
|--------|--------|
| React + Vite | Fastest dev experience, massive ecosystem, deploys to static hosting |
| React Native + Expo | Single codebase for iOS + Android, EAS build in minutes |
| Firebase | Serverless, scales to zero cost, no server management |
| Zustand | Lighter than Redux, no boilerplate, perfect for e-commerce cart state |
| TailwindCSS | Utility-first, consistent design system, no CSS file maintenance |
| Stripe | Industry standard, handles PCI compliance for you |
| TaxJar | Automated US sales tax compliance across all 50 states |

### Full Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│   ┌─────────────────┐         ┌─────────────────────────┐  │
│   │  Web App        │         │  Mobile App              │  │
│   │  React 18+Vite  │         │  React Native + Expo     │  │
│   │  TailwindCSS    │         │  NativeWind              │  │
│   │  Zustand        │         │  Zustand                 │  │
│   └────────┬────────┘         └────────────┬─────────────┘  │
└────────────┼────────────────────────────────┼───────────────┘
             │ HTTPS                          │ HTTPS
┌────────────▼────────────────────────────────▼───────────────┐
│                   FIREBASE PLATFORM                          │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Firebase │  │Firestore │  │ Firebase │  │ Firebase │  │
│  │   Auth   │  │   DB     │  │ Storage  │  │Functions │  │
│  │ (users)  │  │(data)    │  │ (media)  │  │(logic)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──┬───────┘  │
└──────────────────────────────────────────────────┼──────────┘
                                                   │ API calls
             ┌─────────────────────────────────────▼────────┐
             │              THIRD-PARTY APIS                 │
             │  ┌──────────┐ ┌─────────┐ ┌───────────────┐ │
             │  │  Stripe  │ │ TaxJar  │ │ Meta Graph API│ │
             │  │Payments  │ │Tax Calc │ │(Instagram/FB) │ │
             │  └──────────┘ └─────────┘ └───────────────┘ │
             │  ┌──────────────────────┐                    │
             │  │  YouTube Data API    │                    │
             │  │  (Auto-posting)      │                    │
             │  └──────────────────────┘                    │
             └──────────────────────────────────────────────┘
```

---

## 5. Project Structure

```
DiscoverHEX/                          ← Monorepo root
├── README.md                         ← Project overview
├── .github/
│   └── workflows/
│       ├── deploy.yml                ← CI/CD: deploy on push to main
│       └── pr-check.yml              ← CI/CD: build check on PRs
│
├── docs/                             ← Business & technical documentation
│   ├── BUSINESS_PLAN.md              ← Full investor-ready business plan
│   ├── TECH_ARCHITECTURE.md          ← System design + setup guide
│   ├── INVESTOR_PITCH.md             ← 10-slide pitch deck outline
│   ├── PROJECT_STATUS.md             ← Execution log + next steps
│   └── DOCUMENTATION.md             ← This file — complete solution guide
│
├── web/                              ← React 18 web application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx                  ← React root with BrowserRouter + Toaster
│       ├── App.jsx                   ← Route definitions (10 routes)
│       ├── index.css                 ← Tailwind base + custom utilities
│       ├── pages/
│       │   ├── Home.jsx              ← Landing page with hero + charity + sponsors
│       │   ├── Marketplace.jsx       ← Product grid with search + filters
│       │   ├── ProductDetail.jsx     ← Full product page with gallery
│       │   ├── Checkout.jsx          ← Cart → Tax → Payment flow
│       │   ├── Charity.jsx           ← Transparency dashboard + campaigns
│       │   ├── Sponsors.jsx          ← Sponsor showcase + apply form
│       │   ├── Crowdfunding.jsx      ← Investment campaigns + invest modal
│       │   ├── Influencers.jsx       ← Creator program + apply form
│       │   ├── Login.jsx             ← Firebase Auth (email + Google OAuth)
│       │   └── Dashboard.jsx         ← User orders + charity impact
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx        ← Sticky nav + cart badge + auth
│       │   │   └── Footer.jsx        ← Brand footer + newsletter
│       │   ├── marketplace/
│       │   │   ├── ProductCard.jsx   ← Reusable product card
│       │   │   └── CartDrawer.jsx    ← Slide-in cart sidebar
│       │   └── charity/
│       │       └── CharityCounter.jsx ← Animated scroll-triggered counter
│       ├── services/
│       │   ├── firebase.js           ← Firebase app init (auth, db, storage)
│       │   ├── taxService.js         ← TaxJar API proxy + 8.25% fallback
│       │   ├── socialService.js      ← Instagram/FB/YouTube auto-post
│       │   └── stripeService.js      ← Stripe PaymentIntent helpers
│       ├── store/
│       │   └── useStore.js           ← Zustand: cart, user, checkout, UI
│       └── data/
│           └── mockData.js           ← 12 products, 5 sponsors, 4 charities, 6 creators
│
├── mobile/                           ← React Native + Expo mobile app
│   ├── app.json                      ← Expo config + bundle IDs
│   ├── eas.json                      ← EAS build profiles
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── navigation/
│       │   └── AppNavigator.jsx      ← Tab + Stack navigation
│       ├── screens/
│       │   ├── HomeScreen.jsx        ← Gradient hero + categories + charity widget
│       │   ├── MarketplaceScreen.jsx ← Search + category filter + FlatList grid
│       │   ├── ProductDetailScreen.jsx ← Full product with sticky add-to-cart
│       │   ├── CartScreen.jsx        ← Cart items + promo codes + summary
│       │   ├── CheckoutScreen.jsx    ← Address form + Stripe + confirmation
│       │   ├── CharityScreen.jsx     ← Campaigns + counter + donations feed
│       │   └── ProfileScreen.jsx     ← Login + order stats + creator section
│       ├── components/
│       │   ├── ProductCard.jsx       ← RN product card (StyleSheet)
│       │   ├── CategoryChip.jsx      ← Filter chip with active state
│       │   └── CharityWidget.jsx     ← Mini charity progress card
│       ├── services/
│       │   └── firebase.js           ← Firebase RN init
│       ├── store/
│       │   └── useStore.js           ← Zustand (same shape as web)
│       ├── data/
│       │   └── mockData.js           ← Shared mock data
│       └── utils/
│           └── formatters.js         ← formatPrice, formatDate, formatNumber
│
└── backend/                          ← Firebase Functions + security rules
    ├── firebase.json
    ├── .firebaserc
    ├── firestore.rules
    ├── firestore.indexes.json
    ├── storage.rules
    └── functions/
        ├── package.json
        ├── .env.example
        └── src/
            ├── index.js              ← Exports all functions
            ├── checkout/
            │   ├── createPaymentIntent.js  ← Cart validation + tax + Stripe intent
            │   └── handleStripeWebhook.js  ← payment_intent.succeeded handler
            ├── tax/
            │   └── calculateTax.js         ← TaxJar proxy + Firestore caching
            ├── social/
            │   ├── autoPost.js             ← IG/FB/YT post functions
            │   └── scheduledPosts.js       ← Daily/weekly scheduled posts
            ├── charity/
            │   └── charityManager.js       ← Fund allocation + impact reports
            ├── sponsors/
            │   └── sponsorManager.js       ← Impression/sale/ROI tracking
            └── creators/
                └── creatorManager.js       ← Commission + payout management
```

---

## 6. Web App — Page by Page

### `/` — Home Page
**File:** `web/src/pages/Home.jsx`

Sections in order:
1. **Hero** — Full-width dark section with ambient orange glow, "Discover Human Excellence" headline, Shop Now + Join Creators CTAs, 4 live stats (orders, revenue, countries, charity donated)
2. **Category Grid** — 5 category cards with icon, label, hover animation, links to `/marketplace?category=X`
3. **Featured Products** — 4 ProductCard components from best-selling mock data
4. **Sponsor Zone** — Horizontal scroll of SponsorChip components with tier labels
5. **Charity Impact** — 4 CharityCampaignCard components with animated progress bars
6. **Creator Section** — "Join 500+ Creators" banner with commission highlights
7. **Crowdfunding Teaser** — "Invest in HEX Nation" block with progress bar and tier cards
8. **CTA Banner** — Final full-width call to action

### `/marketplace` — Marketplace
**File:** `web/src/pages/Marketplace.jsx`

- Sticky sidebar filter panel (desktop) / modal (mobile)
- Search bar filters by name, description, and tags in real time
- Category filter synced to URL `?category=` param
- Sort: Most Popular / Newest / Price Low→High / High→Low / Top Rated
- Price slider: $0–$300
- Responsive grid: 1col mobile → 2col tablet → 3col desktop
- Empty state when no results match

### `/product/:id` — Product Detail
**File:** `web/src/pages/ProductDetail.jsx`

- Image gallery with thumbnail switcher
- Sponsor badge (if product is sponsored)
- Star rating with partial star support
- Strikethrough original price + savings pill
- Charity donation preview (updates with quantity)
- Color swatch selector
- Quantity selector (1–10)
- "Add to Cart" disabled when out of stock
- Web Share API with clipboard fallback
- Related products from same category

### `/checkout` — Checkout
**File:** `web/src/pages/Checkout.jsx`

- Empty cart guard → redirects to marketplace
- Shipping form: first/last name, email, street, city, all 50 US states, zip
- **Auto tax calculation**: fires 600ms after state + zip filled, calls `taxService.calculateTax()`, shows spinner → result → "(estimated)" label
- Card inputs: number auto-formats `xxxx xxxx xxxx xxxx`, expiry `MM/YY`, CVV
- Charity causes list from cart items
- Order summary: subtotal + tax + shipping + charity = total
- Post-order: success screen, cart cleared, navigates home after 3.5s

### `/charity` — Charity Transparency
**File:** `web/src/pages/Charity.jsx`

- Hero with live stats: total donated, orders with donation, lives impacted, active campaigns
- Campaign cards with IntersectionObserver-triggered animated progress bars
- "How It Works" 3-step section
- Impact stories grid (pulled from campaign data)
- FAQ accordion (RegCF, charity verification, cause selection)
- CTA → `/marketplace`

### `/sponsors` — Sponsor Zone
**File:** `web/src/pages/Sponsors.jsx`

- Dark premium theme (`#0F0F1A` background)
- Benefits grid: Reach, Charity Co-Branding, Product Placement, Analytics
- Current sponsor gallery with tier badges (Gold/Silver/Bronze)
- Feature comparison table across tiers
- Apply form: name, company, email, tier, message

### `/invest` — Crowdfunding
**File:** `web/src/pages/Crowdfunding.jsx`

- 2 live campaigns: HEX Creator Studio App (Seed) + HEX Flagship Store Chicago (Series A)
- Per-campaign: image, funding progress bar, investors/days/min-invest stats, perks accordion
- Invest modal: tier radio buttons, custom amount input, RegCF disclaimer
- How It Works: 3 steps
- FAQ: securities, returns, SAFE agreements

### `/creators` — Influencer/Creator Program
**File:** `web/src/pages/Influencers.jsx`

- Hero with IG/YT icons
- 4-step "How It Works" grid
- Commission tier cards: Nano/Micro/Macro/Mega with rates
- Auto-posting tools section: Instagram, YouTube, Facebook
- Top Creators gallery (from mockData.creators)
- Apply form: name, email, handle, followers, niche

### `/login` — Authentication
**File:** `web/src/pages/Login.jsx`

- Sign In / Sign Up tab toggle
- Real Firebase Auth: `signInWithEmailAndPassword` + `createUserWithEmailAndPassword`
- Real Google OAuth: `signInWithPopup(auth, googleProvider)`
- Error code → human message mapping
- Password show/hide toggle
- Connects to Zustand `setUser` on success

### `/dashboard` — User Dashboard
**File:** `web/src/pages/Dashboard.jsx`

- Auth guard (shows sign-in prompt if no user)
- Profile header with initial avatar
- Stats: total orders, total spent, total charity donated
- Order history with per-order charity impact
- Charity impact card linking to `/charity`
- Account menu: Settings, Saved, Creator Dashboard

---

## 7. Mobile App — Screen by Screen

### Tab Navigation
**File:** `mobile/src/navigation/AppNavigator.jsx`

5 tabs: Home, Marketplace, Cart (with badge), Charity, Profile  
Each tab has its own Stack navigator for drill-down.  
Brand colors: navy background, orange active indicators.

### HomeScreen
Full-screen ScrollView with:
- Navy header with DiscoverHEX logo + cart icon
- LinearGradient hero banner (orange → navy)
- Horizontal category chips ScrollView
- Featured products FlatList (horizontal)
- CharityWidget showing running monthly total
- Sponsor spotlight card
- "Join HEX Creators" CTA banner

### MarketplaceScreen
- TextInput search bar with live filtering
- Horizontal category chip filter row
- 2-column FlatList product grid
- Filters by category and search query simultaneously
- Empty state with illustration

### ProductDetailScreen
- 300px full-width image with overlay share button
- Category badge, sponsor badge
- Star rating row
- Charity callout box with orange left-border
- Description section
- Sticky "Add to Cart" footer with success state

### CartScreen
- FlatList of cart items with image, name, qty controls, remove
- Promo code input (HEX10 = 10%, HEX20 = 20%, GIVEBACK = 5% extra charity)
- Order summary: subtotal, discount, charity (5%), tax (8.5%), total
- "Proceed to Checkout" CTA

### CheckoutScreen
- Address form with validation (name, street, city, state, zip)
- Cart items summary with images
- Tax + charity breakdown
- Stripe React Native payment placeholder
- Order success screen with order number + charity donation confirmation

### CharityScreen
- Navy hero header: "Every Purchase Helps"
- Large donation counter card with monthly progress
- 3-column impact stats (donors, campaigns, countries)
- 4 campaign cards with animated progress bars
- Recent donations FlatList feed

### ProfileScreen
- Unauthenticated: email/password login form + creator mode hint
- Authenticated: initials avatar, order/spent/donated stats
- Creator section (conditionally shown if `isCreator = true`)
- Account menu, Sign Out button

---

## 8. Backend — Function by Function

### `checkout/createPaymentIntent.js`
**Trigger:** HTTPS callable  
**Flow:**
1. Validate cart items (check existence in Firestore products collection)
2. Call TaxJar for tax amount
3. Calculate charity allocation (5–10% based on product `charityPercent`)
4. Create Stripe `PaymentIntent` with full metadata
5. Return `{ clientSecret, taxAmount, charityAmount, total }`

### `checkout/handleStripeWebhook.js`
**Trigger:** HTTPS (Stripe webhook POST)  
**On `payment_intent.succeeded`:**
1. Create order document in `/orders/{orderId}`
2. Update product inventory counts
3. Write charity allocation to `/charityFunds/{campaignId}/transactions/{txId}`
4. Call `autoPost()` with order summary
5. Queue email confirmation

**On `payment_intent.payment_failed`:**
- Update order status to `failed`

### `tax/calculateTax.js`
**Trigger:** HTTPS callable  
**Flow:**
1. Check Firestore cache for same state+zip+amount combination
2. If cache miss → call TaxJar `/v2/taxes` endpoint
3. Write result to `/taxCache/{key}` with 24h TTL
4. Return full breakdown: `{ amount_to_collect, rate, breakdown, jurisdictions }`

### `social/autoPost.js`
**Functions:**
- `postNewProduct(product)` — posts to Instagram + Facebook when product added
- `postOrderMilestone(milestone)` — posts when sales milestone hit (100, 500, 1000 orders)
- `generateCaption(product, type)` — AI-style caption with hashtags per platform

**Instagram:** Meta Graph API `/{ig-user-id}/media` + `/{ig-user-id}/media_publish`  
**Facebook:** `/{page-id}/feed` with link attachment  
**YouTube:** Community post via `activities.insert` in YouTube Data API

### `social/scheduledPosts.js`
**Schedules:**
- `dailyHighlightPost` — runs 10:00 AM UTC, queries top product by `reviews` count, posts to all platforms
- `weeklyCharityUpdate` — runs Mondays 9:00 AM UTC, aggregates last week's donations, generates impact summary, posts everywhere

### `charity/charityManager.js`
**Functions:**
- `allocateToCharity(orderId, amount)` — distributes % to campaign buckets
- `getCampaignProgress()` — returns all campaigns with raised/goal/percent
- `updateCampaignStatus(campaignId, amount)` — atomic increment on campaign `raised`
- `getImpactReport()` — aggregated stats for Charity page

### `sponsors/sponsorManager.js`
**Functions:**
- `trackSponsorImpression(sponsorId, productId)` — increments impression counter
- `trackSponsorSale(sponsorId, orderId, amount)` — logs attributed sale
- `calculateSponsorROI(sponsorId, dateRange)` — returns impressions, sales, revenue, ROI %
- `getSponsorDashboard(sponsorId)` — full analytics bundle

### `creators/creatorManager.js`
**Functions:**
- `trackCreatorSale(creatorId, orderId, commission)` — logs commission earned
- `getCreatorDashboard(creatorId)` — earnings, clicks, conversion rate, top products
- `processCreatorPayout(creatorId)` — creates Stripe Transfer to creator's connected account

---

## 9. Key Integrations

### Stripe (Payments)
```
Flow: Client → createPaymentIntent (Firebase Function) → Stripe
→ PaymentIntent.clientSecret → Stripe.js Elements on client
→ confirmPayment() → success/failure
→ Stripe webhook → handleStripeWebhook Firebase Function

Required:
- STRIPE_SECRET_KEY (backend)
- STRIPE_WEBHOOK_SECRET (backend)
- VITE_STRIPE_PUBLISHABLE_KEY (web frontend)
```

### TaxJar (Auto Tax Calculation)
```
Flow: Checkout state change (zip+state) → 600ms debounce
→ taxService.calculateTax() → Firebase Function proxy
→ TaxJar /v2/taxes API → JSON response
→ Cached in Firestore for 24h → Display breakdown in UI

Required:
- TAXJAR_API_KEY (backend)
- VITE_TAXJAR_API_KEY (web — for direct calls, optional)

Fallback: 8.25% flat rate if TaxJar unreachable (displayed as "estimated")
```

### Meta Graph API (Instagram + Facebook Auto-Post)
```
Setup:
1. Create Meta Developer App at developers.facebook.com
2. Add Instagram Graph API + Pages API products
3. Get Page Access Token (long-lived)
4. Get Instagram Business Account ID linked to your page

Flow: Order placed / new product added
→ handleStripeWebhook calls autoPost()
→ POST /v18.0/{ig-user-id}/media (creates container)
→ POST /v18.0/{ig-user-id}/media_publish (publishes)
→ POST /v18.0/{page-id}/feed (Facebook post)

Required:
- META_APP_ID
- META_APP_SECRET
- META_PAGE_ACCESS_TOKEN
- META_IG_USER_ID
```

### YouTube Data API (Auto-Post)
```
Setup:
1. Enable YouTube Data API v3 in Google Cloud Console
2. Create OAuth2 credentials for server-side app
3. Authorize your YouTube channel once to get refresh token

Flow: Weekly scheduled post OR milestone
→ scheduledPosts.weeklyCharityUpdate()
→ youtube.activities.insert() with communityPost type

Required:
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET
- YOUTUBE_REFRESH_TOKEN
```

### Firebase Auth
```
Supported methods:
- Email + Password (signInWithEmailAndPassword)
- Google OAuth (signInWithPopup with GoogleAuthProvider)
- Apple Sign-In (add AppleAuthProvider — future)

Required:
- Enable Email/Password and Google in Firebase Console → Authentication → Sign-in methods
```

---

## 10. Environment Variables

### Web (`web/.env.local`)
```env
# Firebase
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=discoverhex.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=discoverhex-prod
VITE_FIREBASE_STORAGE_BUCKET=discoverhex-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend API (Firebase Functions URL)
VITE_API_BASE_URL=https://us-central1-discoverhex-prod.cloudfunctions.net/api
```

### Mobile (`mobile/.env`)
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=discoverhex.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=discoverhex-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=discoverhex-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_STRIPE_KEY=pk_live_...
EXPO_PUBLIC_API_BASE_URL=https://us-central1-discoverhex-prod.cloudfunctions.net/api
```

### Backend (`backend/functions/.env`)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TAXJAR_API_KEY=your_taxjar_token
META_APP_ID=123456789
META_APP_SECRET=abcdef123...
META_PAGE_ACCESS_TOKEN=EAABwz...
META_IG_USER_ID=17841400...
YOUTUBE_CLIENT_ID=xxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=xxx
YOUTUBE_REFRESH_TOKEN=1//xxx
CHARITY_WALLET_ID=wallet_xxx
```

---

## 11. Step-by-Step Setup Guide

### Prerequisites
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Git (`git --version`)
- Firebase CLI: `npm install -g firebase-tools`
- Expo CLI: `npm install -g expo-cli`

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Harikrhari/DiscoverHEX.git
cd DiscoverHEX
git checkout claude/discoverhex-marketplace-plan-5sne3v
```

### Step 2 — Set Up Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project" → name it `discoverhex-prod`
3. Enable Google Analytics (optional)
4. Go to **Project Settings → General** → copy the Firebase config values
5. Go to **Authentication → Sign-in methods** → enable **Email/Password** and **Google**
6. Go to **Firestore Database** → Create database (start in test mode, add rules later)
7. Go to **Storage** → Get started (default rules are fine for now)

### Step 3 — Configure Web App
```bash
cd web
cp .env.example .env.local
# Open .env.local and fill in all VITE_FIREBASE_* values from Firebase Console
# Add your Stripe publishable key
npm install
npm run dev
# → Opens at http://localhost:3000
```

### Step 4 — Configure Backend
```bash
cd backend
firebase login
firebase use discoverhex-prod

cd functions
cp .env.example .env
# Fill in STRIPE_SECRET_KEY, TAXJAR_API_KEY, etc.
npm install
cd ..

# Start local emulators
firebase emulators:start
# → Firestore: http://localhost:4000
# → Functions: http://localhost:5001
```

### Step 5 — Configure Mobile
```bash
cd mobile
cp .env.example .env
# Fill in EXPO_PUBLIC_FIREBASE_* values
npm install
npx expo start
# → Scan QR code with Expo Go app (iOS App Store / Google Play)
# → OR press 'a' for Android emulator, 'i' for iOS simulator
```

### Step 6 — Configure Stripe Webhooks (Local Testing)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# Forward webhooks to local Firebase emulator
stripe listen --forward-to localhost:5001/discoverhex-prod/us-central1/stripeWebhook
# Copy the webhook signing secret into backend/functions/.env as STRIPE_WEBHOOK_SECRET
```

---

## 12. Deployment Guide

### Deploy Backend (Firebase Functions + Rules)
```bash
cd backend
firebase deploy
# Deploys: Functions, Firestore rules, Storage rules, indexes
```

### Deploy Web App (Firebase Hosting)
```bash
cd web

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
# → Live at: https://discoverhex-prod.web.app
# → Custom domain: Add in Firebase Console → Hosting → Add custom domain
```

### Build Mobile App (Expo EAS)
```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli
eas login

# Configure project (first time)
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### GitHub Actions CI/CD (Automatic)

The repo includes two workflows:
- **`deploy.yml`** — triggers on push to `main` → builds web, deploys Functions, triggers EAS build
- **`pr-check.yml`** — triggers on PR → validates all 3 apps build without errors

Add these secrets to GitHub repository settings:
```
FIREBASE_SERVICE_ACCOUNT   → Download from Firebase Console → Service Accounts
EXPO_TOKEN                 → From expo.dev → Access Tokens
VITE_FIREBASE_API_KEY      → (and all other VITE_* keys)
VITE_STRIPE_PUBLISHABLE_KEY
```

---

## 13. User Flow Diagrams

### Purchase Flow
```
User lands on Home
     │
     ▼
Browse Marketplace ──→ Apply Filters/Search
     │
     ▼
Product Detail Page
     │ "Add to Cart"
     ▼
Cart Drawer (slide-in)
     │ "Checkout"
     ▼
Checkout Page
     ├─ Fill shipping address
     ├─ [AUTO] Tax calculated via TaxJar (600ms debounce)
     ├─ Enter card details
     └─ "Place Order"
          │
          ▼
     Firebase Function: createPaymentIntent
          ├─ Validate cart
          ├─ Calculate final tax
          ├─ Allocate charity %
          └─ Create Stripe PaymentIntent
               │
               ▼
          Stripe processes payment
               │
          Stripe webhook → handleStripeWebhook
               ├─ Create order in Firestore
               ├─ Write charity allocation
               └─ Trigger social auto-post
                    │
                    ▼
          Success screen → Dashboard
```

### Creator Flow
```
Creator visits /creators
     │ "Apply"
     ▼
Submit application form
     │
     ▼
[Manual review by DiscoverHEX team]
     │ Approved
     ▼
Creator gets unique referral link per product
     │
     ▼
Creator posts to IG/YT/FB (using HEX auto-posting tools)
     │
     ▼
Customer clicks link → buys product
     │
     ▼
Firebase Function: trackCreatorSale()
     │
     ▼
Commission added to creator account
     │
     ▼
Monthly: processCreatorPayout() → Stripe Transfer to creator
```

### Charity Flow
```
Customer completes purchase ($49.99 product, 7% charity)
     │
     ▼
Stripe webhook fires
     │
     ▼
charityManager.allocateToCharity(orderId, $3.50)
     │
     ├─ Write to /charityFunds/sports-dev/transactions/txId
     │    { amount: 3.50, orderId, timestamp, productId }
     │
     └─ Atomic increment on /charityFunds/sports-dev.raised += 3.50
          │
          ▼
Charity page reads live from Firestore
Customer can see their $3.50 in the transparent feed
```

---

## 14. Database Schema

### Firestore Collections

```
/users/{userId}
├── email: string
├── name: string
├── isCreator: boolean
├── creatorId: string | null
├── stripeCustomerId: string | null
├── createdAt: timestamp

/products/{productId}
├── name: string
├── category: 'sports' | 'health' | 'outdoor' | 'gadgets' | 'lifestyle'
├── price: number
├── originalPrice: number
├── images: string[]
├── description: string
├── inStock: boolean
├── rating: number
├── reviews: number
├── sponsored: boolean
├── sponsorId: string | null
├── charityPercent: number (5–10)
├── charityCampaignId: string
├── badge: string | null
├── tags: string[]
├── createdAt: timestamp

/orders/{orderId}
├── userId: string
├── items: [{productId, name, price, quantity, charityPercent}]
├── shippingAddress: {street, city, state, zip, country}
├── subtotal: number
├── taxAmount: number
├── shippingAmount: number
├── charityAmount: number
├── total: number
├── stripePaymentIntentId: string
├── status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'failed'
├── creatorId: string | null
├── createdAt: timestamp

/charityFunds/{campaignId}
├── title: string
├── cause: string
├── goal: number
├── raised: number (atomic increment)
├── beneficiaries: number
├── /transactions/{txId}
│   ├── orderId: string
│   ├── amount: number
│   ├── timestamp: timestamp
│   └── productId: string

/sponsors/{sponsorId}
├── name: string
├── tier: 'gold' | 'silver' | 'bronze'
├── monthlyFee: number
├── totalImpressions: number
├── totalSales: number
├── totalRevenue: number
├── activeFrom: timestamp
├── products: string[] (productIds sponsored)

/creators/{creatorId}
├── userId: string
├── handle: string
├── platform: string
├── followers: number
├── commissionRate: number
├── totalEarnings: number
├── stripeConnectedAccountId: string
├── /commissions/{txId}
│   ├── orderId: string
│   ├── amount: number
│   └── timestamp: timestamp

/taxCache/{cacheKey}
├── result: object (TaxJar response)
├── expiresAt: timestamp
```

---

## 15. API Reference

### Firebase Callable Functions

#### `createPaymentIntent`
```js
// Client call
const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
const result = await createPaymentIntent({
  items: [{ id: 'p1', quantity: 2, price: 49.99, charityPercent: 7 }],
  shippingAddress: { street: '123 Main', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
  shipping: 9.99
});
// Returns: { clientSecret, taxAmount, charityAmount, total }
```

#### `calculateTax`
```js
const calculateTax = httpsCallable(functions, 'calculateTax');
const result = await calculateTax({
  items: [{ product_id: 'p1', quantity: 1, unit_price: 49.99 }],
  shipping_address: { street: '...', city: '...', state: 'TX', zip: '78701', country: 'US' },
  shipping: 9.99
});
// Returns: { taxAmount, rate, breakdown, jurisdiction, estimated }
```

#### `postToSocial`
```js
const postToSocial = httpsCallable(functions, 'postToSocial');
await postToSocial({
  platforms: ['instagram', 'facebook', 'youtube'],
  product: { id: 'p1', name: 'HEX Pro Resistance Band Set', price: 49.99, imageUrl: '...' },
  type: 'new_product'
});
```

---

## 16. File Index

| # | Path | Description |
|---|------|-------------|
| 1 | `README.md` | Project overview and quick start |
| 2 | `.github/workflows/deploy.yml` | CD pipeline: build + deploy on main |
| 3 | `.github/workflows/pr-check.yml` | CI pipeline: validate PRs |
| 4 | `docs/BUSINESS_PLAN.md` | Investor-ready business plan |
| 5 | `docs/TECH_ARCHITECTURE.md` | System design + setup |
| 6 | `docs/INVESTOR_PITCH.md` | 10-slide pitch deck outline |
| 7 | `docs/PROJECT_STATUS.md` | Execution log + next steps |
| 8 | `docs/DOCUMENTATION.md` | This file |
| 9 | `web/package.json` | Web dependencies |
| 10 | `web/vite.config.js` | Vite config with path aliases |
| 11 | `web/tailwind.config.js` | HEX brand colors + animations |
| 12 | `web/postcss.config.js` | PostCSS config |
| 13 | `web/index.html` | HTML entry point |
| 14 | `web/.env.example` | Web environment variables template |
| 15 | `web/src/main.jsx` | React 18 root + BrowserRouter + Toaster |
| 16 | `web/src/App.jsx` | Route definitions (10 routes) |
| 17 | `web/src/index.css` | Global styles + utility classes |
| 18 | `web/src/pages/Home.jsx` | Landing page |
| 19 | `web/src/pages/Marketplace.jsx` | Product marketplace |
| 20 | `web/src/pages/ProductDetail.jsx` | Product detail |
| 21 | `web/src/pages/Checkout.jsx` | Checkout with tax |
| 22 | `web/src/pages/Charity.jsx` | Charity transparency |
| 23 | `web/src/pages/Sponsors.jsx` | Sponsor showcase |
| 24 | `web/src/pages/Crowdfunding.jsx` | Investment campaigns |
| 25 | `web/src/pages/Influencers.jsx` | Creator program |
| 26 | `web/src/pages/Login.jsx` | Firebase Auth |
| 27 | `web/src/pages/Dashboard.jsx` | User dashboard |
| 28 | `web/src/components/layout/Navbar.jsx` | Navigation bar |
| 29 | `web/src/components/layout/Footer.jsx` | Footer |
| 30 | `web/src/components/marketplace/ProductCard.jsx` | Product card |
| 31 | `web/src/components/marketplace/CartDrawer.jsx` | Cart sidebar |
| 32 | `web/src/components/charity/CharityCounter.jsx` | Animated counter |
| 33 | `web/src/services/firebase.js` | Firebase init |
| 34 | `web/src/services/taxService.js` | TaxJar integration |
| 35 | `web/src/services/socialService.js` | Social auto-post |
| 36 | `web/src/services/stripeService.js` | Stripe helpers |
| 37 | `web/src/store/useStore.js` | Zustand store |
| 38 | `web/src/data/mockData.js` | Mock products/sponsors/creators |
| 39 | `mobile/package.json` | Mobile dependencies (Expo SDK 50) |
| 40 | `mobile/app.json` | Expo + bundle IDs |
| 41 | `mobile/eas.json` | EAS build profiles |
| 42 | `mobile/.env.example` | Mobile environment template |
| 43 | `mobile/src/navigation/AppNavigator.jsx` | Tab + Stack nav |
| 44 | `mobile/src/screens/HomeScreen.jsx` | Mobile home |
| 45 | `mobile/src/screens/MarketplaceScreen.jsx` | Mobile marketplace |
| 46 | `mobile/src/screens/ProductDetailScreen.jsx` | Mobile product |
| 47 | `mobile/src/screens/CartScreen.jsx` | Mobile cart |
| 48 | `mobile/src/screens/CheckoutScreen.jsx` | Mobile checkout |
| 49 | `mobile/src/screens/CharityScreen.jsx` | Mobile charity |
| 50 | `mobile/src/screens/ProfileScreen.jsx` | Mobile profile/auth |
| 51 | `mobile/src/components/ProductCard.jsx` | RN product card |
| 52 | `mobile/src/components/CategoryChip.jsx` | Filter chip |
| 53 | `mobile/src/components/CharityWidget.jsx` | Charity mini widget |
| 54 | `mobile/src/services/firebase.js` | Firebase RN init |
| 55 | `mobile/src/store/useStore.js` | Zustand (mobile) |
| 56 | `mobile/src/data/mockData.js` | Shared mock data |
| 57 | `mobile/src/utils/formatters.js` | Price/date/number formatters |
| 58 | `backend/firebase.json` | Firebase project config |
| 59 | `backend/.firebaserc` | Firebase project alias |
| 60 | `backend/firestore.rules` | Firestore security rules |
| 61 | `backend/firestore.indexes.json` | Composite indexes |
| 62 | `backend/storage.rules` | Storage security rules |
| 63 | `backend/functions/package.json` | Functions dependencies |
| 64 | `backend/functions/.env.example` | Backend secrets template |
| 65 | `backend/functions/src/index.js` | Functions entry + exports |
| 66 | `backend/functions/src/checkout/createPaymentIntent.js` | Stripe intent |
| 67 | `backend/functions/src/checkout/handleStripeWebhook.js` | Webhook handler |
| 68 | `backend/functions/src/tax/calculateTax.js` | TaxJar proxy |
| 69 | `backend/functions/src/social/autoPost.js` | Social posting |
| 70 | `backend/functions/src/social/scheduledPosts.js` | Scheduled posts |
| 71 | `backend/functions/src/charity/charityManager.js` | Charity fund logic |
| 72 | `backend/functions/src/sponsors/sponsorManager.js` | Sponsor analytics |
| 73 | `backend/functions/src/creators/creatorManager.js` | Creator commissions |

---

*DiscoverHEX — Human Excellence Marketplace | Built for impact, designed for scale*
