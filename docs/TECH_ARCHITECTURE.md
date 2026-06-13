# DiscoverHEX — Technical Architecture Document
## Version 1.0 | June 2026 | Confidential

---

# 1. OVERVIEW

DiscoverHEX is built as a **monorepo** containing three primary workspaces:

| Workspace | Technology | Purpose |
|-----------|------------|---------|
| `/web` | React 18 + Vite + TailwindCSS | Customer-facing web marketplace |
| `/mobile` | React Native + Expo (SDK 51+) | iOS and Android apps |
| `/backend` | Firebase (Functions + Firestore) | API, business logic, data layer |

The platform is designed to be **fast to build, easy to maintain, and low-cost at initial scale** — leveraging Firebase's serverless infrastructure to eliminate infrastructure management overhead and allow a small engineering team to move quickly.

### Design Principles

1. **Serverless-first:** No managed servers. All compute runs in Firebase Cloud Functions.
2. **Mobile-first UX:** Every UI decision starts from the mobile viewport.
3. **Separation of concerns:** Web, mobile, and backend are independently deployable.
4. **Real-time by default:** Firestore real-time listeners power the charity dashboard, order status, and live inventory.
5. **Automation at the core:** Social media posting, charity fund allocation, and commission calculations are event-driven, not manual.

---

# 2. STACK CHOICE RATIONALE

## Why React + Vite (Web)

| Factor | Rationale |
|--------|-----------|
| Developer ecosystem | Largest frontend ecosystem; easiest to hire for |
| Vite build speed | Sub-second HMR in development; fast CI builds |
| TailwindCSS | Utility-first CSS eliminates style conflicts; fast UI iteration |
| SEO capability | Vite SSG / React Router with meta tags for product pages |
| Component reuse | Shared logic with React Native via custom hooks |

## Why React Native + Expo (Mobile)

| Factor | Rationale |
|--------|-----------|
| Code sharing | Shares hooks, utilities, and API clients with web |
| Expo EAS | Managed build pipeline; no Xcode/Android Studio required for CI |
| OTA updates | Push JavaScript updates without App Store review for most changes |
| Large library support | Expo modules cover camera, notifications, payments, biometrics |
| Time to market | Single codebase for iOS + Android vs. native development |

## Why Firebase (Backend)

| Factor | Rationale |
|--------|-----------|
| No server management | Scales automatically from 0 to millions of requests |
| Real-time database | Firestore listeners power live charity dashboard without polling |
| Integrated auth | Firebase Auth handles Google, Apple, Email with 5 lines of code |
| Low initial cost | Generous free tier; pay-as-you-go pricing |
| Firebase Functions | Node.js serverless functions for business logic and webhooks |
| Firebase Hosting | Global CDN for web app with zero DevOps |
| Firebase Storage | Product images, charity proof photos, creator content |
| Firebase Analytics | Built-in user behavior tracking with zero configuration |

---

# 3. SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                   │
│   ┌─────────────────┐          ┌─────────────────────────┐       │
│   │   Web App        │          │     Mobile App           │       │
│   │  React + Vite   │          │  React Native + Expo    │       │
│   │  TailwindCSS    │          │   iOS + Android          │       │
│   └────────┬────────┘          └───────────┬─────────────┘       │
└────────────│─────────────────────────────────│───────────────────┘
             │                                 │
             │          HTTPS / WSS            │
             ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FIREBASE PLATFORM                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Firebase     │  │  Firestore   │  │  Firebase Functions   │  │
│  │ Auth         │  │  (Database)  │  │  (Node.js Serverless) │  │
│  │              │  │              │  │                       │  │
│  │ Google       │  │  Real-time   │  │  • Payment webhooks   │  │
│  │ Apple        │  │  listeners   │  │  • Tax calculation    │  │
│  │ Email/Pass   │  │  NoSQL       │  │  • Social auto-post   │  │
│  └──────────────┘  └──────────────┘  │  • Charity alloc.    │  │
│                                       │  • Commission calc.  │  │
│  ┌──────────────┐  ┌──────────────┐  │  • Email triggers    │  │
│  │  Firebase    │  │  Firebase    │  └───────────────────────┘  │
│  │  Storage     │  │  Hosting     │                              │
│  │              │  │              │  ┌───────────────────────┐  │
│  │  Product     │  │  Web App     │  │  Firebase Analytics   │  │
│  │  images      │  │  CDN deploy  │  │  + Remote Config      │  │
│  │  Proof docs  │  │              │  └───────────────────────┘  │
│  └──────────────┘  └──────────────┘                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    External API Integrations
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌──────────────────┐
│     STRIPE      │   │    TAXJAR API   │   │  SOCIAL MEDIA    │
│                 │   │                 │   │  APIS            │
│ Payment intent  │   │ Real-time tax   │   │                  │
│ Webhooks        │   │ calculation     │   │ Meta Graph API   │
│ Refunds         │   │ by ZIP code     │   │ (Instagram/FB)   │
│ Payouts         │   │ Nexus tracking  │   │                  │
│ (Creator $)     │   │                 │   │ YouTube Data API │
└─────────────────┘   └─────────────────┘   │                  │
                                             │ TikTok API       │
                                             │ (optional)       │
                                             └──────────────────┘
         ┌───────────────────────┐
         ▼                       ▼
┌─────────────────┐   ┌─────────────────┐
│   SENDGRID /    │   │  CHARITY        │
│   FIREBASE EXT  │   │  PARTNER APIs   │
│                 │   │                 │
│ Transactional   │   │ Disbursement    │
│ email           │   │ confirmation    │
│ Impact receipts │   │ Impact proof    │
└─────────────────┘   └─────────────────┘
```

---

# 4. DATABASE SCHEMA (FIRESTORE)

Firestore is a document/collection NoSQL database. All schemas below represent document structures within their respective collections.

## 4.1 `users` Collection

```
users/{userId}
├── uid: string                    // Firebase Auth UID
├── email: string
├── displayName: string
├── photoURL: string
├── role: enum ['shopper', 'creator', 'sponsor', 'admin']
├── createdAt: timestamp
├── updatedAt: timestamp
├── profile: {
│   ├── bio: string
│   ├── website: string
│   ├── socialHandles: {
│   │   ├── instagram: string
│   │   ├── youtube: string
│   │   ├── tiktok: string
│   │   └── facebook: string
│   └── }
│   └── location: { city, state, country }
├── creatorProfile: {              // only if role === 'creator'
│   ├── tier: enum ['spark','flame','blaze','inferno']
│   ├── commissionRate: number     // 0.10 to 0.20
│   ├── totalEarnings: number
│   ├── pendingPayout: number
│   ├── approvedAt: timestamp
│   └── followerCount: number
├── }
├── shippingAddresses: [           // subcollection or array
│   {
│   ├── id: string
│   ├── isDefault: boolean
│   ├── name: string
│   ├── street1: string
│   ├── street2: string
│   ├── city: string
│   ├── state: string
│   ├── zip: string
│   └── country: string
│   }
└── ]
```

## 4.2 `products` Collection

```
products/{productId}
├── id: string
├── name: string
├── slug: string                   // URL-friendly identifier
├── description: string
├── shortDescription: string
├── category: enum ['sports-fitness','health-wellness','outdoor-adventure','ai-gadgets','premium-lifestyle']
├── subcategory: string
├── images: string[]               // Firebase Storage URLs
├── pricing: {
│   ├── basePrice: number          // What DiscoverHEX pays supplier
│   ├── retailPrice: number        // Listed price to customers
│   ├── compareAtPrice: number     // Strikethrough price (optional)
│   └── currency: string           // 'USD'
├── }
├── inventory: {
│   ├── trackInventory: boolean
│   ├── quantity: number
│   └── lowStockThreshold: number
├── }
├── sponsorId: string | null       // Reference to sponsors collection
├── sponsorMargin: number          // % margin DiscoverHEX earns from sponsor
├── charityPercentage: number      // 0.05 to 0.10
├── tags: string[]
├── attributes: {                  // Flexible product attributes
│   ├── weight: string
│   ├── dimensions: string
│   ├── material: string
│   └── ...
├── }
├── seo: {
│   ├── metaTitle: string
│   └── metaDescription: string
├── }
├── status: enum ['draft','active','archived']
├── featured: boolean
├── hexCertified: boolean          // Passed HEX Quality Standard
├── ratings: {
│   ├── average: number
│   └── count: number
├── }
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 4.3 `orders` Collection

```
orders/{orderId}
├── id: string
├── userId: string
├── status: enum ['pending','processing','shipped','delivered','refunded','cancelled']
├── items: [
│   {
│   ├── productId: string
│   ├── productName: string        // Snapshot at time of order
│   ├── quantity: number
│   ├── unitPrice: number
│   ├── charityAmount: number      // Calculated at checkout
│   └── sponsorId: string | null
│   }
├── ]
├── pricing: {
│   ├── subtotal: number
│   ├── taxAmount: number          // From TaxJar
│   ├── taxRate: number
│   ├── shippingAmount: number
│   ├── discountAmount: number
│   ├── totalCharityAmount: number // Sum of all item charity amounts
│   └── grandTotal: number
├── }
├── shippingAddress: { ... }       // Snapshot of address
├── payment: {
│   ├── stripePaymentIntentId: string
│   ├── stripeChargeId: string
│   ├── method: string             // 'card', 'apple_pay', 'google_pay'
│   └── paidAt: timestamp
├── }
├── shipping: {
│   ├── carrier: string
│   ├── trackingNumber: string
│   └── estimatedDelivery: timestamp
├── }
├── creatorReferral: {             // If order came through creator link
│   ├── creatorId: string
│   ├── commissionRate: number
│   └── commissionAmount: number
├── }
├── charityAllocationId: string    // Reference to charityFunds document
├── impactReceiptSent: boolean
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 4.4 `sponsors` Collection

```
sponsors/{sponsorId}
├── id: string
├── companyName: string
├── contactEmail: string
├── contactName: string
├── website: string
├── tier: enum ['bronze','silver','gold','platinum']
├── categories: string[]           // Which categories they sponsor
├── monthlyFee: number
├── marginPercentage: number       // DiscoverHEX margin on their products
├── contractStart: timestamp
├── contractEnd: timestamp
├── status: enum ['pending','active','paused','terminated']
├── metrics: {
│   ├── totalProductsSold: number
│   ├── totalRevenue: number
│   ├── totalImpressions: number
│   └── lastUpdated: timestamp
├── }
├── branding: {
│   ├── logoUrl: string
│   ├── brandColor: string
│   └── tagline: string
└── }
```

## 4.5 `charityFunds` Collection

```
charityFunds/{fundId}
├── id: string
├── orderId: string
├── userId: string                 // Shopper who generated this fund
├── amount: number
├── status: enum ['allocated','disbursed','pending']
├── causeId: string                // Reference to causes subcollection
├── allocatedAt: timestamp
└── disbursedAt: timestamp | null

// Global charity stats (single document)
charityFunds/GLOBAL_STATS
├── totalAllocated: number
├── totalDisbursed: number
├── totalOrders: number
├── lastUpdated: timestamp
└── byCause: {
    ├── education: number
    ├── orphanWelfare: number
    ├── sportsDevlopment: number
    └── medicalAid: number
    }

// Subcollection for causes
charityFunds/causes/{causeId}
├── id: string
├── name: string
├── description: string
├── category: enum ['education','orphan-welfare','sports-development','medical-aid']
├── partnerOrg: string
├── verificationStatus: enum ['pending','verified','audited']
├── totalReceived: number
├── impactMilestones: [
│   {
│   ├── description: string
│   ├── amount: number
│   ├── achievedAt: timestamp
│   └── proofUrl: string
│   }
└── ]
```

## 4.6 `creators` Collection

```
creators/{creatorId}
├── id: string                     // Same as userId
├── userId: string
├── applicationStatus: enum ['pending','approved','rejected','suspended']
├── tier: enum ['spark','flame','blaze','inferno']
├── commissionRate: number
├── trackingCode: string           // Unique referral code
├── approvedProducts: string[]     // Product IDs they can promote
├── campaigns: [                   // Active campaigns
│   {
│   ├── campaignId: string
│   ├── productId: string
│   ├── customLink: string
│   ├── clicks: number
│   ├── conversions: number
│   └── earnings: number
│   }
├── ]
├── earnings: {
│   ├── total: number
│   ├── pending: number            // Awaiting payout cycle
│   ├── paid: number
│   └── lastPayoutAt: timestamp
├── }
├── socialProof: {
│   ├── instagramFollowers: number
│   ├── youtubeSubscribers: number
│   ├── tiktokFollowers: number
│   └── verifiedAt: timestamp
└── }
```

## 4.7 `campaigns` Collection

```
campaigns/{campaignId}
├── id: string
├── name: string
├── type: enum ['product-launch','seasonal','sponsor-collab','charity-drive']
├── sponsorId: string | null
├── productIds: string[]
├── creatorIds: string[]
├── startDate: timestamp
├── endDate: timestamp
├── status: enum ['draft','active','paused','completed']
├── metrics: {
│   ├── totalImpressions: number
│   ├── totalClicks: number
│   ├── totalConversions: number
│   ├── totalRevenue: number
│   └── charityGenerated: number
├── }
├── socialPosts: [                 // Auto-generated social content
│   {
│   ├── platform: enum ['instagram','facebook','youtube','tiktok']
│   ├── content: string
│   ├── mediaUrl: string
│   ├── scheduledAt: timestamp
│   ├── postedAt: timestamp | null
│   └── postId: string | null      // Platform's post ID after posting
│   }
└── ]
```

---

# 5. FIREBASE SERVICES

| Service | Usage in DiscoverHEX |
|---------|----------------------|
| **Firestore** | Primary database for all collections listed above |
| **Firebase Auth** | User authentication (Google, Apple, Email/Password) |
| **Cloud Functions** | Payment processing, charity allocation, social posting, webhooks |
| **Firebase Storage** | Product images, creator content, charity proof documents |
| **Firebase Hosting** | Web app deployment with global CDN |
| **Firebase Analytics** | User behavior tracking, conversion funnels, retention |
| **Remote Config** | Feature flags for gradual rollouts and A/B testing |
| **Cloud Messaging (FCM)** | Push notifications (mobile) for orders, promotions, impact updates |
| **Firebase Extensions** | Stripe Payments Extension, SendGrid Email Extension |

---

# 6. THIRD-PARTY INTEGRATIONS

## 6.1 Stripe — Payments

**Purpose:** Accept payments, manage payouts to creators, process refunds.

**Integration points:**
- `stripe.paymentIntents.create()` — called from Firebase Function when order is placed
- Stripe webhook → Firebase Function `onStripeWebhook` → update order status in Firestore
- Stripe Connect — creator payout accounts (creators onboard their bank/debit via Stripe Express)
- Apple Pay / Google Pay — enabled via Stripe Payment Element

**Environment variables required:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...  (frontend)
```

## 6.2 TaxJar — Automatic Tax Calculation

**Purpose:** Calculate accurate US sales tax at checkout based on customer ZIP code and product type. Maintain sales tax nexus compliance as DiscoverHEX scales into new states.

**Integration flow:**
1. Customer enters shipping address at checkout
2. Frontend calls Firebase Function `calculateTax`
3. Function calls TaxJar API with: `from_zip`, `to_zip`, `to_state`, `amount`, `shipping`
4. TaxJar returns precise tax amount and rate
5. Tax amount is displayed to customer before payment confirmation
6. After order completes, TaxJar transaction is recorded for reporting

**Environment variables required:**
```
TAXJAR_API_KEY=...
TAXJAR_FROM_ZIP=...     // DiscoverHEX fulfillment origin ZIP
TAXJAR_FROM_STATE=...
```

**Key TaxJar features used:**
- `POST /v2/taxes` — real-time tax calculation
- `POST /v2/transactions/orders` — record completed orders for reporting
- `GET /v2/nexus/regions` — manage nexus states as business grows

## 6.3 Meta Graph API — Instagram & Facebook Auto-Posting

**Purpose:** Automatically publish product spotlight content, campaign launches, and charity milestones to DiscoverHEX's Instagram and Facebook pages.

**Integration flow (Firebase Function: `autoPostToMeta`):**
1. Trigger: new product published, campaign starts, or charity milestone reached
2. Function generates post content (caption + media URL from Firebase Storage)
3. Calls Meta Graph API:
   - Instagram: `POST /{ig-user-id}/media` → container creation
   - Instagram: `POST /{ig-user-id}/media_publish` → publish container
   - Facebook Page: `POST /{page-id}/photos` or `POST /{page-id}/feed`
4. Store returned `post_id` in Firestore campaign/product document
5. Log posting status and any errors

**Environment variables required:**
```
META_APP_ID=...
META_APP_SECRET=...
META_ACCESS_TOKEN=...         // Long-lived page access token
META_INSTAGRAM_ACCOUNT_ID=...
META_FACEBOOK_PAGE_ID=...
```

## 6.4 YouTube Data API — Auto-Posting to YouTube

**Purpose:** Upload product highlight videos and campaign content to DiscoverHEX's YouTube channel automatically.

**Integration flow (Firebase Function: `autoPostToYouTube`):**
1. Trigger: new product video uploaded to Firebase Storage
2. Function downloads video from Storage, uploads to YouTube via resumable upload
3. Sets title, description, tags, and category automatically from product metadata
4. Publishes as public video or schedules for optimal posting time
5. Returns YouTube video ID, stores in Firestore

**Environment variables required:**
```
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...     // Service account with channel access
YOUTUBE_CHANNEL_ID=...
```

## 6.5 TikTok API — Optional

**Purpose:** Auto-post short product clips and creator content to TikTok for maximum Gen Z reach.

**Status:** Planned for Phase 2 after primary social channels are automated.

**Key endpoint:** `POST /v2/post/publish/video/init/` (TikTok Content Posting API)

---

# 7. FOLDER STRUCTURE

```
discoverhex/                          # Monorepo root
├── .github/
│   └── workflows/
│       ├── web-deploy.yml            # Deploy web to Firebase Hosting
│       ├── functions-deploy.yml      # Deploy Firebase Functions
│       └── mobile-build.yml          # EAS build trigger
├── web/                              # React + Vite web app
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/                   # Images, fonts, static files
│   │   ├── components/
│   │   │   ├── common/               # Shared UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Spinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   └── ProductImages.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.jsx
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   ├── checkout/
│   │   │   │   ├── CheckoutForm.jsx
│   │   │   │   ├── TaxCalculator.jsx
│   │   │   │   ├── AddressForm.jsx
│   │   │   │   └── PaymentElement.jsx
│   │   │   ├── charity/
│   │   │   │   ├── ImpactDashboard.jsx
│   │   │   │   ├── CauseCard.jsx
│   │   │   │   ├── ImpactTicker.jsx
│   │   │   │   └── ImpactReceipt.jsx
│   │   │   ├── creator/
│   │   │   │   ├── CreatorDashboard.jsx
│   │   │   │   ├── EarningsCard.jsx
│   │   │   │   ├── CampaignCard.jsx
│   │   │   │   └── ApplicationForm.jsx
│   │   │   └── sponsor/
│   │   │       ├── SponsorBadge.jsx
│   │   │       ├── SponsorZone.jsx
│   │   │       └── SponsorDashboard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── ImpactPage.jsx
│   │   │   ├── CreatorHub.jsx
│   │   │   ├── SponsorHub.jsx
│   │   │   ├── Account.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   ├── useOrders.js
│   │   │   ├── useCharity.js
│   │   │   └── useCreator.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   ├── firebase.js           # Firebase app init
│   │   │   ├── auth.js               # Auth helpers
│   │   │   ├── firestore.js          # Firestore CRUD helpers
│   │   │   ├── storage.js            # Firebase Storage helpers
│   │   │   ├── stripe.js             # Stripe frontend helpers
│   │   │   └── functions.js          # Firebase Functions callers
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatDate.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.local                    # Local env vars (gitignored)
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── mobile/                           # React Native + Expo app
│   ├── app/                          # Expo Router file-based routing
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (tabs)/
│   │   │   ├── index.tsx             # Home / Discover
│   │   │   ├── marketplace.tsx
│   │   │   ├── impact.tsx            # Charity dashboard
│   │   │   ├── creator.tsx           # Creator hub
│   │   │   └── account.tsx
│   │   ├── product/
│   │   │   └── [id].tsx
│   │   ├── checkout/
│   │   │   ├── cart.tsx
│   │   │   ├── address.tsx
│   │   │   └── payment.tsx
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── charity/
│   │   └── creator/
│   ├── hooks/                        # Shared with web where possible
│   ├── services/
│   │   ├── firebase.ts
│   │   └── stripe.ts
│   ├── utils/
│   ├── assets/
│   ├── app.json                      # Expo config
│   ├── eas.json                      # EAS Build config
│   ├── babel.config.js
│   └── package.json
│
├── backend/                          # Firebase Functions
│   ├── functions/
│   │   ├── src/
│   │   │   ├── index.ts              # Function exports
│   │   │   ├── payments/
│   │   │   │   ├── createPaymentIntent.ts
│   │   │   │   ├── stripeWebhook.ts
│   │   │   │   └── processRefund.ts
│   │   │   ├── tax/
│   │   │   │   └── calculateTax.ts
│   │   │   ├── orders/
│   │   │   │   ├── createOrder.ts
│   │   │   │   ├── updateOrderStatus.ts
│   │   │   │   └── sendImpactReceipt.ts
│   │   │   ├── charity/
│   │   │   │   ├── allocateFunds.ts
│   │   │   │   └── updateGlobalStats.ts
│   │   │   ├── creators/
│   │   │   │   ├── calculateCommission.ts
│   │   │   │   └── processPayouts.ts
│   │   │   ├── social/
│   │   │   │   ├── autoPostToMeta.ts
│   │   │   │   ├── autoPostToYouTube.ts
│   │   │   │   └── generatePostContent.ts
│   │   │   ├── products/
│   │   │   │   └── onProductPublished.ts
│   │   │   └── utils/
│   │   │       ├── firestore.ts
│   │   │       ├── stripe.ts
│   │   │       ├── taxjar.ts
│   │   │       └── email.ts
│   │   ├── .env                      # Function environment vars (gitignored)
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── firestore.rules               # Firestore security rules
│   ├── storage.rules                 # Storage security rules
│   └── firebase.json                 # Firebase project config
│
├── shared/                           # Shared types and utilities
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── creator.ts
│   │   └── charity.ts
│   └── constants/
│       ├── categories.ts
│       └── tiers.ts
│
├── .gitignore
├── package.json                      # Root workspace config
└── README.md
```

---

# 8. AUTHENTICATION FLOW

## Firebase Auth with Google / Apple / Email

```
User visits Login page
        │
        ▼
Choose auth method:
┌──────────────┬──────────────┬─────────────────┐
│  Google SSO  │   Apple SSO  │  Email/Password  │
└──────┬───────┴──────┬───────┴────────┬────────┘
       │              │                │
       ▼              ▼                ▼
Firebase Auth SDK handles OAuth flow
       │
       ▼
Firebase returns User object + JWT token
       │
       ▼
Check Firestore: does users/{uid} exist?
       │
    ┌──┴──┐
   YES    NO
    │      │
    │      ▼
    │   Create user document in Firestore
    │   Set role: 'shopper'
    │      │
    ▼      ▼
Store auth state in AuthContext
       │
       ▼
Redirect to intended page or Home
```

### Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Products are publicly readable, only admin can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders: user can read own orders; creation through Functions only
    match /orders/{orderId} {
      allow read: if request.auth != null
                  && request.auth.uid == resource.data.userId;
      allow create, update: if false; // Only Firebase Functions can write orders
    }

    // Charity stats: publicly readable
    match /charityFunds/{document=**} {
      allow read: if true;
      allow write: if false; // Only Functions
    }
  }
}
```

---

# 9. CHECKOUT FLOW WITH TAX CALCULATION

```
Customer clicks "Proceed to Checkout"
              │
              ▼
Step 1: Review Cart
  - Display items, quantities, subtotal
  - Show estimated charity contribution
              │
              ▼
Step 2: Shipping Address
  - Address form (or select saved address)
  - On ZIP code entry → call Firebase Function: calculateTax
              │
              ▼
Firebase Function: calculateTax
  - Calls TaxJar API: POST /v2/taxes
  - Returns: taxAmount, taxRate
  - Updates cart state with tax
              │
              ▼
Step 3: Review Order
  - Subtotal + Tax + Shipping + Charity Contribution = Grand Total
  - Customer confirms order summary
              │
              ▼
Step 4: Payment
  - Stripe Payment Element renders (card / Apple Pay / Google Pay)
  - Call Firebase Function: createPaymentIntent
              │
              ▼
Firebase Function: createPaymentIntent
  - stripe.paymentIntents.create({ amount, currency, metadata })
  - Returns clientSecret to frontend
              │
              ▼
Stripe confirms payment on frontend
              │
              ▼
Stripe Webhook → Firebase Function: stripeWebhook
  - Event: payment_intent.succeeded
  - Create order document in Firestore
  - Trigger: allocateCharityFunds()
  - Trigger: calculateCreatorCommission()
  - Trigger: sendImpactReceipt() (email)
  - Trigger: updateInventory()
              │
              ▼
Customer redirected to Order Confirmation page
  - Order summary
  - Charity impact contribution shown
  - "Share your impact" CTA for social sharing
```

---

# 10. SOCIAL MEDIA AUTO-POSTING PIPELINE

```
Trigger event occurs:
  - New product published (status: draft → active)
  - Campaign starts
  - Charity milestone reached ($1K, $5K, $10K, etc.)
  - Creator joins platform
              │
              ▼
Firebase Function: onProductPublished (or campaign/milestone trigger)
              │
              ▼
generatePostContent()
  - Pulls product name, description, images, charity % from Firestore
  - Generates platform-specific captions:
    * Instagram: 150 chars + hashtags + charity hook
    * Facebook: longer form with link
    * YouTube: title + description + tags
  - Stores generated content in campaigns/{id}/socialPosts
              │
              ▼
Upload media to respective platform:
              │
    ┌─────────┼──────────────┐
    ▼         ▼              ▼
Instagram  Facebook     YouTube
Graph API  Graph API   Data API
    │         │              │
    ▼         ▼              ▼
Store post_id in Firestore
              │
              ▼
Log success/failure in campaign metrics
If failure → retry queue with exponential backoff
              │
              ▼
Admin notification if multiple failures
```

### Auto-Post Content Template (Instagram example)

```
🏆 NEW DROP: {productName}

{shortDescription}

✅ HEX Certified Quality
💚 {charityPercentage}% of your purchase funds {causeCategory}
🔗 Shop now: link in bio

#DiscoverHEX #HumanExcellence #BestVersionOfYourself
#{category} #{productTag} #HEXImpact
```

---

# 11. CHARITY FUND TRACKING FLOW

```
Order placed and payment confirmed
              │
              ▼
Firebase Function: allocateFunds()
  - Calculate charityAmount = sum(item.price * item.charityPercentage)
  - Create charityFunds/{fundId} document:
    {
      orderId, userId, amount,
      status: 'allocated',
      causeId: selectedCause,
      allocatedAt: now()
    }
              │
              ▼
Update charityFunds/GLOBAL_STATS (atomic increment):
  - totalAllocated += charityAmount
  - totalOrders += 1
  - byCause[causeCategory] += charityAmount
              │
              ▼
Real-time Firestore listener → ImpactDashboard updates instantly
              │
              ▼
[End of month] Admin triggers: processDisbursements()
  - Aggregate all 'allocated' charityFunds documents
  - Verify against bank/payment records
  - Transfer funds to charity partner accounts
  - Update status: 'allocated' → 'disbursed'
  - Update disbursedAt timestamp
              │
              ▼
Charity partner confirms receipt, uploads proof (photo/report)
  - Impact proof stored in Firebase Storage
  - Linked to cause document in Firestore
              │
              ▼
Impact Dashboard updates with proof
Quarterly report auto-generated and published
```

---

# 12. SPONSOR DASHBOARD

## Sponsor Portal Features

The sponsor portal (accessible at `/sponsor-hub` with `role: 'sponsor'` auth) provides:

**Overview Panel:**
- Total products sold under sponsorship
- Revenue generated (gross + net)
- Impressions and click-through rates
- Charity amount generated through their products

**Campaign Management:**
- Create and edit sponsored campaigns
- Upload brand assets (logos, product images, videos)
- Set budget limits and duration
- Select target product categories

**Creator Matching:**
- View creators promoting their products
- Request specific creator partnerships
- See creator performance metrics per product

**Analytics (refreshed daily):**
```
┌─────────────────────────────────────────────┐
│  SPONSOR DASHBOARD — Acme Fitness Co.        │
├─────────────────────────────────────────────┤
│  This Month                                  │
│  Products Sold:     342        ▲ 28%         │
│  Gross Revenue:     $22,450    ▲ 31%         │
│  Your Margin:       $4,490     (20%)         │
│  Creator Posts:     47                       │
│  Impressions:       128,000    ▲ 45%         │
│  Charity Generated: $1,347                   │
├─────────────────────────────────────────────┤
│  Top Performing Creator: @fitnesswithjake    │
│  Top Product: HEX Resistance Band Set        │
└─────────────────────────────────────────────┘
```

---

# 13. DEPLOYMENT

## 13.1 Web — Firebase Hosting

```bash
# Build and deploy web app
cd web
npm run build
firebase deploy --only hosting
```

**Firebase Hosting config (`firebase.json`):**
```json
{
  "hosting": {
    "public": "web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=31536000" }]
      }
    ]
  }
}
```

## 13.2 Mobile — Expo EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
cd mobile
eas build:configure

# Build for both platforms
eas build --platform all --profile production

# Submit to App Store and Play Store
eas submit --platform all
```

**EAS config (`eas.json`):**
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "staging": {
      "distribution": "internal",
      "env": { "APP_ENV": "staging" }
    },
    "production": {
      "env": { "APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "your@apple.com", "ascAppId": "..." },
      "android": { "serviceAccountKeyPath": "./google-service-account.json" }
    }
  }
}
```

## 13.3 Backend — Firebase Functions

```bash
cd backend/functions
npm run build
firebase deploy --only functions
```

## 13.4 GitHub Actions CI/CD

### Web Deploy Workflow (`.github/workflows/web-deploy.yml`)

```yaml
name: Deploy Web to Firebase Hosting

on:
  push:
    branches: [main]
    paths: ['web/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        run: cd web && npm ci

      - name: Build
        run: cd web && npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: discoverhex-prod
```

### Functions Deploy Workflow (`.github/workflows/functions-deploy.yml`)

```yaml
name: Deploy Firebase Functions

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend/functions && npm ci && npm run build
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

# 14. ENVIRONMENT VARIABLES

## Web App (`web/.env.local`)

```bash
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=discoverhex-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=discoverhex-prod
VITE_FIREBASE_STORAGE_BUCKET=discoverhex-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe (frontend — publishable key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App Config
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

## Firebase Functions (`backend/functions/.env`)

```bash
# Firebase (auto-injected in Functions, but needed for local emulator)
FIREBASE_PROJECT_ID=discoverhex-prod

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# TaxJar
TAXJAR_API_KEY=...
TAXJAR_FROM_ZIP=10001
TAXJAR_FROM_STATE=NY

# Meta (Instagram/Facebook)
META_APP_ID=...
META_APP_SECRET=...
META_ACCESS_TOKEN=...
META_INSTAGRAM_ACCOUNT_ID=...
META_FACEBOOK_PAGE_ID=...

# YouTube
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...
YOUTUBE_CHANNEL_ID=...

# Email (SendGrid)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@discoverhex.com

# TikTok (Phase 2)
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
TIKTOK_ACCESS_TOKEN=...
```

---

# 15. LOCAL SETUP — STEP BY STEP

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | https://nodejs.org |
| npm | 10+ | Bundled with Node |
| Firebase CLI | Latest | `npm install -g firebase-tools` |
| Expo CLI | Latest | `npm install -g expo-cli` |
| EAS CLI | Latest | `npm install -g eas-cli` |
| Git | Any | https://git-scm.com |

## Step 1 — Clone the Repository

```bash
git clone https://github.com/discoverhex/discoverhex.git
cd discoverhex
```

## Step 2 — Install Dependencies

```bash
# Install root dependencies (workspaces)
npm install

# Install web dependencies
cd web && npm install && cd ..

# Install mobile dependencies
cd mobile && npm install && cd ..

# Install backend function dependencies
cd backend/functions && npm install && cd ../..
```

## Step 3 — Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already configured)
firebase init

# Select: Firestore, Functions, Hosting, Storage, Emulators
# Connect to your Firebase project or create one at console.firebase.google.com
```

## Step 4 — Configure Environment Variables

```bash
# Web
cp web/.env.example web/.env.local
# Fill in all values from Firebase Console and Stripe Dashboard

# Functions
cp backend/functions/.env.example backend/functions/.env
# Fill in all API keys
```

**Firebase Console setup:**
1. Go to https://console.firebase.google.com
2. Create project: `discoverhex-dev`
3. Enable Authentication → Google, Apple, Email/Password
4. Create Firestore database (start in test mode for development)
5. Enable Storage
6. Copy config to `web/.env.local`

## Step 5 — Start Firebase Emulators

```bash
cd backend
firebase emulators:start
# Emulator UI: http://localhost:4000
# Firestore: http://localhost:8080
# Functions: http://localhost:5001
# Auth: http://localhost:9099
```

## Step 6 — Run the Web App

```bash
cd web
npm run dev
# Web app: http://localhost:5173
```

## Step 7 — Run the Mobile App

```bash
cd mobile
npx expo start
# Scan QR code with Expo Go app (iOS/Android)
# Or press 'i' for iOS Simulator / 'a' for Android Emulator
```

## Step 8 — Seed Initial Data (Optional)

```bash
cd backend
node scripts/seedDatabase.js
# Creates sample products, categories, and test sponsor
```

---

# 16. DEPLOYMENT — STEP BY STEP

## Step 1 — Set Up Production Firebase Project

```bash
firebase projects:create discoverhex-prod
firebase use discoverhex-prod
```

Enable in Firebase Console:
- Authentication providers (Google, Apple, Email)
- Firestore (production mode)
- Storage
- Firebase Hosting
- Firebase Functions (requires Blaze pay-as-you-go plan)

## Step 2 — Set Production Environment Secrets (GitHub)

In GitHub repository → Settings → Secrets and Variables → Actions:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_STRIPE_PUBLISHABLE_KEY
FIREBASE_SERVICE_ACCOUNT    (JSON from Firebase Console → Service Accounts)
FIREBASE_TOKEN              (from: firebase login:ci)
```

## Step 3 — Set Functions Environment Variables

```bash
# Set all secrets for production functions
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set TAXJAR_API_KEY
firebase functions:secrets:set META_ACCESS_TOKEN
firebase functions:secrets:set META_APP_SECRET
firebase functions:secrets:set YOUTUBE_REFRESH_TOKEN
firebase functions:secrets:set SENDGRID_API_KEY
# ... (repeat for all secrets)
```

## Step 4 — Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## Step 5 — Deploy Firebase Functions

```bash
cd backend/functions
npm run build
firebase deploy --only functions
```

## Step 6 — Build and Deploy Web App

```bash
cd web
npm run build
firebase deploy --only hosting
```

## Step 7 — Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://us-central1-discoverhex-prod.cloudfunctions.net/stripeWebhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy webhook secret to Firebase Functions secrets

## Step 8 — Submit Mobile Apps

```bash
cd mobile
eas build --platform all --profile production
eas submit --platform ios
eas submit --platform android
```

## Step 9 — Configure DNS

Point `discoverhex.com` to Firebase Hosting:
1. Firebase Console → Hosting → Add custom domain
2. Follow DNS verification and A record setup instructions

## Step 10 — Enable Analytics and Monitoring

```bash
firebase deploy --only extensions
# Enable Firebase Performance Monitoring in the console
# Set up uptime checks and error alerting
```

---

# 17. PERFORMANCE CONSIDERATIONS

| Area | Strategy |
|------|----------|
| Image optimization | Firebase Storage + serve WebP format, lazy loading |
| Code splitting | Vite automatic route-based splitting |
| Firestore reads | Pagination (limit 20), efficient queries, composite indexes |
| Function cold starts | Keep functions warm with min-instances for critical paths |
| CDN caching | Firebase Hosting caches static assets with long TTL |
| Mobile bundle size | Expo tree-shaking, dynamic imports for heavy screens |

---

*DiscoverHEX Inc. — Technical Architecture v1.0*
*All specifications subject to revision during development.*
