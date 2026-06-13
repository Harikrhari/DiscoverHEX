# DiscoverHEX — Master Guide
### Complete Build, Run & Deploy Instructions

> **Repo:** https://github.com/Harikrhari/DiscoverHEX  
> **Branch:** `claude/discoverhex-marketplace-plan-5sne3v`  
> **Last Updated:** June 13, 2026

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [What Each Document Does](#2-what-each-document-does)
3. [Project Completion Status](#3-project-completion-status)
4. [What You Need Before Starting](#4-what-you-need-before-starting)
5. [Step 1 — Get the Code](#step-1--get-the-code)
6. [Step 2 — Set Up Firebase](#step-2--set-up-firebase)
7. [Step 3 — Set Up Stripe Payments](#step-3--set-up-stripe-payments)
8. [Step 4 — Run the Web App](#step-4--run-the-web-app)
9. [Step 5 — Run the Mobile App](#step-5--run-the-mobile-app)
10. [Step 6 — Run the Backend](#step-6--run-the-backend)
11. [Step 7 — Deploy to the Internet](#step-7--deploy-to-the-internet)
12. [Step 8 — Set Up Social Auto-Posting](#step-8--set-up-social-auto-posting)
13. [Step 9 — Set Up Tax Calculation](#step-9--set-up-tax-calculation)
14. [What Still Needs To Be Done](#14-what-still-needs-to-be-done)
15. [Common Errors & Fixes](#15-common-errors--fixes)

---

## 1. What This Project Is

DiscoverHEX is a **complete marketplace platform** with:

- **Web app** — built with React, runs in any browser
- **Mobile app** — built with React Native + Expo, runs on iPhone and Android
- **Backend** — Firebase cloud functions that handle payments, tax, and social posting
- **Business docs** — investor pitch, business plan, architecture guide

Everything is in one folder (called a monorepo):

```
DiscoverHEX/
├── web/        ← Browser app (React)
├── mobile/     ← Phone app (React Native + Expo)
├── backend/    ← Cloud logic (Firebase Functions)
└── docs/       ← Business and technical documents
```

---

## 2. What Each Document Does

All documents are in the `/docs` folder of the repo. Here is exactly what each one is for:

---

### `README.md` ← Start Here
**Location:** Root of repo (top level)  
**Purpose:** Overview of the whole project — what it is, the tech stack, and the fastest way to get it running. This is the first thing anyone sees when they visit the GitHub repo.  
**Who reads it:** Anyone new to the project, developers, investors doing due diligence.

---

### `docs/BUSINESS_PLAN.md`
**Purpose:** A full investor-ready business plan covering:
- Vision and mission
- The problem being solved (fragmented market, no charity transparency)
- Revenue model (product sales + sponsors + creators + crowdfunding)
- Market size (TAM/SAM/SOM)
- Competitive advantages
- Financial projections
- Investment ask

**Who reads it:** Investors, bank loan officers, business partners, potential co-founders.  
**Action:** Print this or share as PDF when pitching to investors.

---

### `docs/INVESTOR_PITCH.md`
**Purpose:** A 10-slide pitch deck in text format — each slide has a title, talking points, and key numbers. Designed to be converted into a PowerPoint or Canva presentation.

**Slides covered:**
1. Cover — DiscoverHEX brand
2. Problem
3. Solution
4. Product Demo
5. Business Model
6. Market Opportunity
7. Traction / Roadmap
8. Competitive Landscape
9. Team
10. The Ask (how much money, what for)

**Who reads it:** Investors during a pitch meeting.  
**Action:** Use this as your script when presenting. Convert each slide text into a Canva slide.

---

### `docs/TECH_ARCHITECTURE.md`
**Purpose:** Explains how all the technical parts connect — the system diagram, which database tables exist, how payments flow, how social posting works, and how to deploy everything. Written for developers and technical co-founders.

**Who reads it:** Developers you hire, CTOs evaluating the stack, technical investors.

---

### `docs/PROJECT_STATUS.md`
**Purpose:** A running checklist showing exactly which files are done and what is still needed. Tracks every file in the repo with Done/Pending status, the git history, and the next steps list.

**Who reads it:** You (the founder), to track progress. Developers joining the team.

---

### `docs/DOCUMENTATION.md`
**Purpose:** The deepest technical reference — covers every single page of the web app, every screen of the mobile app, every backend function, every API integration, and every environment variable. Also includes database schema and API call examples.

**Who reads it:** Any developer building on top of this project.

---

### `docs/MASTER_GUIDE.md` ← You Are Here
**Purpose:** This file. The single practical document for building, running, and launching DiscoverHEX. Written in plain language with step-by-step instructions.

---

## 3. Project Completion Status

### ✅ FULLY COMPLETE — Ready to Use

| What | Files | Notes |
|------|-------|-------|
| Web app — all 10 pages | `web/src/pages/*.jsx` | Home, Marketplace, Product, Checkout, Charity, Sponsors, Crowdfunding, Creators, Login, Dashboard |
| Web app — all components | `web/src/components/` | Navbar, Footer, CartDrawer, ProductCard, CharityCounter |
| Web app — all services | `web/src/services/` | Firebase, Stripe, Tax, Social posting |
| Web app — state management | `web/src/store/useStore.js` | Cart, user, checkout, charity data |
| Web app — mock data | `web/src/data/mockData.js` | 12 products, 5 sponsors, 4 charities, 6 creators |
| Mobile app — all 7 screens | `mobile/src/screens/*.jsx` | Home, Marketplace, Product, Cart, Checkout, Charity, Profile |
| Mobile app — navigation | `mobile/src/navigation/` | Tab bar + stack navigation |
| Mobile app — components | `mobile/src/components/` | ProductCard, CategoryChip, CharityWidget |
| Backend — payments | `backend/functions/src/checkout/` | Stripe integration |
| Backend — tax | `backend/functions/src/tax/` | TaxJar integration |
| Backend — social posting | `backend/functions/src/social/` | Instagram, Facebook, YouTube |
| Backend — charity tracking | `backend/functions/src/charity/` | Fund allocation |
| Backend — sponsor analytics | `backend/functions/src/sponsors/` | ROI tracking |
| Backend — creator commissions | `backend/functions/src/creators/` | Payout management |
| Security rules | `backend/firestore.rules` | Firestore + Storage |
| CI/CD pipelines | `.github/workflows/` | Auto-deploy on push |
| All business documents | `docs/*.md` | 5 documents |

---

### 🔶 NEEDS YOUR INPUT — Requires Your Accounts/Keys

These are done in terms of code, but they need YOUR real account credentials to actually work:

| What | Why Needed | Takes |
|------|-----------|-------|
| Firebase project | The database and login system | 10 minutes |
| Stripe account | To accept real payments | 15 minutes |
| TaxJar account | For automatic US tax calculation | 5 minutes |
| Meta Developer app | For Instagram + Facebook auto-posting | 30 minutes |
| YouTube API | For YouTube auto-posting | 15 minutes |
| Apple Developer account | To publish iOS app | Paid ($99/year) |
| Google Play account | To publish Android app | Paid ($25 once) |

---

### ❌ NOT YET BUILT — Phase 2 Features

These features are planned but not built yet. The MVP works without them:

| Feature | What It Would Do |
|---------|-----------------|
| Admin panel | Add/edit/delete products without touching code |
| Email on order | Send confirmation email when customer orders |
| Product reviews | Let customers leave star ratings and comments |
| Push notifications | Alert users about orders, deals, charity milestones |
| Real product images | Replace placeholder images with actual supplier photos |
| Direct donations | Let users donate to charity without buying anything |
| Creator analytics chart | Visual earnings graph for creators |
| Sponsor self-serve | Let sponsors manage their own campaigns without your help |

---

## 4. What You Need Before Starting

Install these on your computer first. Each has a link and one command to verify it works.

### Node.js (Required for everything)
- Download: https://nodejs.org → choose "LTS" version
- Verify: open Terminal and type `node --version` → should show `v18.x.x` or higher

### npm (Comes with Node.js automatically)
- Verify: `npm --version` → should show `9.x.x` or higher

### Git (Required to download the code)
- Download: https://git-scm.com/downloads
- Verify: `git --version` → should show `git version 2.x.x`

### Firebase CLI (Required for backend)
```bash
npm install -g firebase-tools
firebase --version    # should show 13.x.x
```

### Expo CLI (Required for mobile app)
```bash
npm install -g expo-cli eas-cli
expo --version        # should show 7.x.x or higher
```

### A Code Editor
- Recommended: VS Code — https://code.visualstudio.com (free)

---

## Step 1 — Get the Code

Open Terminal (Mac/Linux) or Command Prompt (Windows) and run these commands one at a time:

```bash
# Download the project from GitHub
git clone https://github.com/Harikrhari/DiscoverHEX.git

# Go into the project folder
cd DiscoverHEX

# Switch to the branch with all the code
git checkout claude/discoverhex-marketplace-plan-5sne3v

# Confirm you can see all the folders
ls
# You should see: web  mobile  backend  docs  README.md
```

---

## Step 2 — Set Up Firebase

Firebase is the database and login system. You need a free account.

### 2.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it: `discoverhex-prod`
4. Click Continue → Enable Google Analytics (optional) → Create project

### 2.2 Get Your Firebase Config Keys
1. In Firebase Console, click the **gear icon** (⚙️) → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **`</>`** (web) icon to add a web app
4. Name it `discoverhex-web` → click **Register app**
5. You will see a block of code that looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "discoverhex-prod.firebaseapp.com",
  projectId: "discoverhex-prod",
  storageBucket: "discoverhex-prod.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Keep this page open — you'll need these values in Step 4.**

### 2.3 Enable Login Methods
1. In Firebase Console, click **Authentication** in the left menu
2. Click **"Get started"**
3. Click **Email/Password** → toggle **Enable** → Save
4. Click **Google** → toggle **Enable** → enter your support email → Save

### 2.4 Create the Database
1. Click **Firestore Database** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Choose your region → Done

### 2.5 Set Up File Storage
1. Click **Storage** in the left menu
2. Click **"Get started"** → Next → Done

---

## Step 3 — Set Up Stripe Payments

Stripe handles all credit card payments securely.

### 3.1 Create Stripe Account
1. Go to https://stripe.com and sign up (free)
2. Verify your email

### 3.2 Get Your Stripe Keys
1. In Stripe Dashboard, click **Developers** → **API keys**
2. You will see two keys:
   - **Publishable key** — starts with `pk_test_...` (safe to use in the web app)
   - **Secret key** — starts with `sk_test_...` (only goes in backend, never share this)

**Keep this page open — you'll need these in Steps 4 and 6.**

---

## Step 4 — Run the Web App

```bash
# Go into the web folder
cd web

# Copy the environment template
cp .env.example .env.local
```

Now open `.env.local` in VS Code and fill in the values from Steps 2 and 3:

```env
# From Firebase (Step 2.2)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=discoverhex-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=discoverhex-prod
VITE_FIREBASE_STORAGE_BUCKET=discoverhex-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# From Stripe (Step 3.2) — use the PUBLISHABLE key only
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Leave this as-is for now (points to Firebase emulator)
VITE_API_BASE_URL=http://localhost:5001/discoverhex-prod/us-central1/api
```

Now install dependencies and start the app:

```bash
# Install all packages (takes 1-2 minutes first time)
npm install

# Start the web app
npm run dev
```

**Open your browser and go to: `http://localhost:3000`**

You should see the DiscoverHEX homepage. You can browse products, add to cart, and view all pages. Login will work once Firebase is connected.

### What Works Right Now (Without Backend Running)
- ✅ All 10 pages load and display correctly
- ✅ Products display from mock data
- ✅ Add to cart works
- ✅ Cart drawer opens
- ✅ Filters and search work
- ✅ All charity, sponsor, crowdfunding pages
- ⚠️ Login will connect to Firebase (needs real keys from Step 2)
- ⚠️ Tax calculation will use 8.25% estimate (needs TaxJar + backend)
- ⚠️ Payment will not complete (needs Stripe + backend)

---

## Step 5 — Run the Mobile App

Open a **new Terminal window** (keep Step 4 running in the first one).

```bash
# Go into the mobile folder from the project root
cd mobile

# Copy the environment template
cp .env.example .env
```

Open `mobile/.env` and fill in the same Firebase values:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=discoverhex-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=discoverhex-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=discoverhex-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_STRIPE_KEY=pk_test_...
EXPO_PUBLIC_API_BASE_URL=http://localhost:5001/discoverhex-prod/us-central1/api
```

```bash
# Install all packages
npm install

# Start the mobile app
npx expo start
```

A QR code will appear in your Terminal.

**To run on your phone:**
1. Download **"Expo Go"** from the App Store (iPhone) or Google Play (Android)
2. Open Expo Go → scan the QR code from Terminal
3. The app will load on your phone in about 30 seconds

**To run in a simulator on your Mac:**
- Press `i` in Terminal for iOS simulator
- Press `a` in Terminal for Android emulator (requires Android Studio)

---

## Step 6 — Run the Backend

Open a **third Terminal window**.

```bash
# Go into the backend folder from the project root
cd backend/functions

# Copy the environment template
cp .env.example .env
```

Open `backend/functions/.env` and fill in:

```env
# From Stripe (Step 3.2) — use the SECRET key here
STRIPE_SECRET_KEY=sk_test_...

# Leave this blank for now — add after setting up Stripe webhooks
STRIPE_WEBHOOK_SECRET=

# From TaxJar (sign up free at taxjar.com → API → Token)
TAXJAR_API_KEY=your_token_here

# Leave social media keys blank for now
META_APP_ID=
META_APP_SECRET=
META_PAGE_ACCESS_TOKEN=
META_IG_USER_ID=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
```

```bash
# Install packages
npm install

# Go back to backend root
cd ..

# Log into Firebase
firebase login
# → Opens browser, sign in with your Google account

# Link to your Firebase project
firebase use discoverhex-prod

# Start the local Firebase emulator (database + functions)
firebase emulators:start
```

You should see output like:
```
✔  functions: Loaded functions definitions from source
✔  firestore: Emulator started at http://localhost:8080
✔  functions: Emulator started at http://localhost:5001
```

**Open `http://localhost:4000` in your browser** → this is the Firebase Emulator dashboard where you can see your database in real time.

---

## Step 7 — Deploy to the Internet

Once everything works locally, follow these steps to make it live on the internet.

### 7.1 Deploy the Backend (Firebase Functions)

```bash
cd backend
firebase deploy
```

This will:
- Upload all 8 backend functions to Firebase cloud
- Apply Firestore security rules
- Apply Storage security rules
- Create database indexes

Takes about 3-5 minutes. At the end you'll see function URLs like:
```
Function URL (createPaymentIntent): https://us-central1-discoverhex-prod.cloudfunctions.net/createPaymentIntent
```

Copy the base URL and update `VITE_API_BASE_URL` in `web/.env.local` to:
```env
VITE_API_BASE_URL=https://us-central1-discoverhex-prod.cloudfunctions.net/api
```

### 7.2 Deploy the Web App

```bash
cd web

# Build the production version
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be live at:
```
https://discoverhex-prod.web.app
```

**To connect a custom domain (e.g., discoverhex.com):**
1. Buy the domain at Namecheap, GoDaddy, or Google Domains
2. In Firebase Console → Hosting → Add custom domain
3. Follow the DNS verification steps (takes up to 24 hours)

### 7.3 Deploy Mobile App to App Stores

**First time setup:**
```bash
cd mobile
eas login          # Log in with your Expo account (create free at expo.dev)
eas build:configure   # Sets up your project
```

**Build for Android (Google Play):**
```bash
eas build --platform android --profile production
```
Requires: Google Play Developer account ($25 one-time at play.google.com/apps/publish)

**Build for iOS (Apple App Store):**
```bash
eas build --platform ios --profile production
```
Requires: Apple Developer Program ($99/year at developer.apple.com)

**Submit to stores:**
```bash
eas submit --platform android   # Submits to Google Play
eas submit --platform ios       # Submits to Apple App Store
```

---

## Step 8 — Set Up Social Auto-Posting

This makes DiscoverHEX automatically post to Instagram, Facebook, and YouTube when products are added or sales milestones are hit.

### 8.1 Instagram + Facebook (Meta)

1. Go to https://developers.facebook.com
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** type → name it `DiscoverHEX`
4. Add products: **Instagram Graph API** and **Facebook Pages API**
5. Go to **Tools → Graph API Explorer**
6. Generate a Page Access Token for your business page
7. Copy these values into `backend/functions/.env`:

```env
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_PAGE_ACCESS_TOKEN=your_page_token
META_IG_USER_ID=your_instagram_business_id
```

**Note:** Your Instagram account must be a **Business or Creator account** connected to a Facebook Page.

### 8.2 YouTube

1. Go to https://console.cloud.google.com
2. Create a new project → name it `discoverhex`
3. Click **APIs & Services** → **Enable APIs** → search "YouTube Data API v3" → Enable
4. Click **Credentials** → Create Credentials → OAuth 2.0 Client ID
5. Application type: **Web application**
6. Add Authorized redirect URI: `https://developers.google.com/oauthplayground`
7. Go to https://developers.google.com/oauthplayground
8. Authorize `https://www.googleapis.com/auth/youtube` scope
9. Exchange for tokens → copy the **Refresh Token**
10. Add to `backend/functions/.env`:

```env
YOUTUBE_CLIENT_ID=xxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=xxx
YOUTUBE_REFRESH_TOKEN=1//xxx
```

---

## Step 9 — Set Up Tax Calculation

TaxJar automatically calculates the correct sales tax for every US state, county, and city.

1. Go to https://www.taxjar.com → click **"Start Free Trial"** (free for small volumes)
2. After signing up → click your name → **Account** → **API Access**
3. Copy your API token
4. Add to `backend/functions/.env`:

```env
TAXJAR_API_KEY=your_token_here
```

**That's it.** The code already calls TaxJar automatically when a customer enters their state and zip code at checkout. If TaxJar is unavailable, it falls back to 8.25% estimated tax.

---

## 14. What Still Needs To Be Done

Here is the honest list of what is built vs. what still needs work before you can take real orders from real customers:

### Must Do Before Taking Real Money

| Task | Why | How Long |
|------|-----|---------|
| Create Firebase project + add keys | App won't work at all without this | 10 min |
| Create Stripe account + add keys | Can't take payments | 15 min |
| Switch Stripe to live mode | Test mode won't charge real cards | 5 min |
| Set up Stripe webhook | Backend won't know when payment succeeds | 10 min |
| Deploy backend to Firebase | Local emulator only works on your computer | 5 min |
| Replace mock product data with real products | Currently shows placeholder products | 1-2 days |
| Upload real product images | Currently uses Unsplash placeholder photos | 1-2 days |

### Should Do Before Launch

| Task | Why | How Long |
|------|-----|---------|
| Set up TaxJar | Tax calculation uses estimate without it | 5 min |
| Connect real domain (discoverhex.com) | Professional credibility | 1 hour |
| Set up Meta API for Instagram/FB | Social auto-posting won't work | 30 min |
| Set up YouTube API | YouTube auto-posting won't work | 15 min |
| Add email confirmation | Customers get no receipt email currently | 2-3 hours |
| Build admin panel | Currently must edit code to add products | 2-3 days |

### Nice to Have (Phase 2)

| Task | When |
|------|------|
| Product reviews system | After first 50 orders |
| Push notifications | After mobile app is published |
| Creator analytics charts | When you have 10+ creators |
| Direct donation (no purchase) | When charity section gets traction |
| Sponsor self-serve portal | When you have 5+ sponsors |

---

## 15. Common Errors & Fixes

### "Module not found" when running `npm run dev`
```bash
# Fix: install dependencies first
cd web && npm install
```

### "FirebaseError: Firebase App named '[DEFAULT]' already exists"
```bash
# Fix: you may have stale environment variables
# Restart the terminal and run again
```

### "Invalid API key" on login
```bash
# Fix: check your .env.local file has the right Firebase keys
# Make sure there are no extra spaces around the = sign
```

### Expo shows "Metro bundler can't start"
```bash
# Fix: clear Expo cache
npx expo start --clear
```

### Firebase emulator won't start ("port in use")
```bash
# Fix: kill whatever is using the port
lsof -ti:5001 | xargs kill -9
lsof -ti:8080 | xargs kill -9
firebase emulators:start
```

### "Error: STRIPE_SECRET_KEY is not defined" in backend
```bash
# Fix: make sure backend/functions/.env exists with your keys
cd backend/functions
cp .env.example .env
# Then add your Stripe secret key
```

### Web app shows blank page after `npm run build`
```bash
# Fix: check your .env.local exists and has all VITE_ variables
# These must be set at BUILD time, not just runtime
```

---

## Quick Reference — All Commands

```bash
# ── Get the code ──────────────────────────────────────────────
git clone https://github.com/Harikrhari/DiscoverHEX.git
cd DiscoverHEX
git checkout claude/discoverhex-marketplace-plan-5sne3v

# ── Web app (runs at http://localhost:3000) ───────────────────
cd web && npm install && npm run dev

# ── Mobile app (scan QR with Expo Go) ────────────────────────
cd mobile && npm install && npx expo start

# ── Backend (runs at http://localhost:5001) ───────────────────
cd backend/functions && npm install
cd .. && firebase emulators:start

# ── Deploy everything ─────────────────────────────────────────
cd backend && firebase deploy
cd web && npm run build && firebase deploy --only hosting
cd mobile && eas build --platform all

# ── Run all three simultaneously (three Terminal tabs) ────────
# Tab 1: cd web     && npm run dev
# Tab 2: cd mobile  && npx expo start
# Tab 3: cd backend && firebase emulators:start
```

---

*DiscoverHEX — Human Excellence Marketplace*  
*Built for impact. Designed to scale. Ready to launch.*
