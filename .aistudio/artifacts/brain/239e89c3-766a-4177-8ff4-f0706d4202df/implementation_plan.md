# UniTrade — Campus Second-Hand Marketplace & Student Gigs

UniTrade is a dedicated peer-to-peer campus marketplace designed exclusively for college students to buy and sell second-hand essentials (textbooks, calculators, electronics, shoes, and hostel gear) with campus pickup or tiered delivery, protected private chats, seller listing boosts, a student freelance gig board, and an admin management dashboard.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed during the planning interview:
> - **Brand & Aesthetic**: "UniTrade" with a vibrant campus blue and emerald accent palette, crisp slate typography, and clean light surfaces.
> - **Start Page Navigation**: Gateway welcome screen featuring three prominent portal cards (Buyer, Seller, and Admin), backed by a persistent top bar and switcher.
> - **Student Authentication**: Phone number-based identity without OTP friction, ensuring fast access while keeping personal numbers private from public listings.
> - **Admin Access**: Protected with the specified password `1234`.

---

### 1. Overview & Core Concept

- **What It Does**: Connects students across colleges and hostels to safely buy and sell used study materials, gadgets, and living essentials. It supports Cash on Delivery (COD), campus pickup, local delivery (₹10) and regional delivery up to 70 km (₹50). It also features listing promotion (₹49 for 1 month boost), a student skills & freelance gig corner, and an admin dashboard for controlling deliveries, pricing, and disputes.
- **Target Audience**: College students living on or off campus, hostelers looking to declutter or furnish rooms affordably, and student freelancers offering skills like PPT design, graphic design, and tutoring.
- **Key Value**: Low-cost, trust-centric student resale without exposing personal phone numbers publicly, with zero-friction sign-in and verified delivery tracking.

---

### 2. User Experience & Visual Design

#### A. Key User Flows

1. **Start Gateway Screen**:
   - Visitors land on a gateway view highlighting three portals: **Buyer Marketplace**, **Seller Portal**, and **Admin Console** (with a secure PIN lock).
   - Quick statistics banner: active campus listings, average student savings, and verified partner colleges.
2. **Buyer Portal**:
   - Filter by college/campus (e.g., Engineering Campuses, Science Campuses, Arts & Commerce), category (Textbooks, Calculators, Electronics, Footwear, Hostel Essentials), price range, and condition (Like New, Good, Fair).
   - Product detail view with photo gallery, condition badges, seller rating, and private inquiry chat.
   - Shopping cart with Cash on Delivery (COD) checkout, delivery method selector (Campus Spot Pickup vs. Local ₹10 vs. Up to 70km ₹50).
   - Order confirmation with instant simulated SMS tracking.
3. **Seller Portal**:
   - Instant phone-based student login.
   - "Sell an Item" form: title, description, category, condition, price, upload photos, and delivery preferences.
   - Listing management: active, sold, inventory counts.
   - "Boost Listing" feature (₹49 for 30 days) to bump items to the top of search and highlight with a featured badge.
   - Order requests manager with delivery status updates.
4. **Admin Portal (`Password: 1234`)**:
   - Master dashboard showing all buyers, sellers, active listings, boosted items, and orders.
   - Delivery management: transition orders through *Pending*, *Out for Delivery*, and *Delivered*.
   - Delivery completion trigger: when marked *Delivered*, dispatches an automated SMS alert to the seller's phone requesting a feedback review.
   - Dynamic price configuration: adjust the Boost Price (default ₹49) and delivery fees (Local ₹10, 70km ₹50).
   - Complaints & dispute resolution feed.
5. **Student Services & Gigs Corner**:
   - Discreetly accessible via a dedicated hyperlink banner in the footer/bottom corner ("Experienced Student? Offer Campus Gigs & Skills").
   - Browse or list freelance student services: Presentation/PPT creation, Graphic Design, Assignment formatting, Resume critique, or "1-on-1 Peer Mentoring / Just Talking".
   - Transparent per-gig pricing with direct inquiry modal.

#### B. Visual Identity & Theme
- **Color Distribution (60-30-10)**:
  - 60% Canvas: Crisp neutral white (`#FFFFFF`) and slate canvas (`#F8FAFC`).
  - 30% Structural: Border lines (`#E2E8F0`), card surfaces (`#FFFFFF`), slate text (`#0F172A`, `#475569`).
  - 10% Accent: Campus Sapphire Blue (`#2563EB`) and Emerald Accent (`#059669`).
- **Typography**: Clean contemporary neo-grotesque font styling (`Plus Jakarta Sans` or modern system sans) with tabular figures for currency and pricing.
- **Zero-Pill Discipline**: Clean unboxed inline metadata separated with `·` (e.g. `IIT Campus · Like New · 2 days ago`). Functional segmented controls for tabs and filters.

---

### 3. Key Product Decisions & Trade-Offs

- **Client-Side Persistent State (`localStorage`) with Realistic Mock Preloads**:
  - *Approach*: Use structured local storage with preloaded realistic campus items across textbooks, TI-84/Casio calculators, noise-canceling headphones, sneakers, and induction cookers.
  - *Why*: Instant reactivity, offline stability, zero backend deployment failure, and easy state reset for testing.
- **Phone-Only No-OTP Authentication**:
  - *Approach*: Users input their 10-digit student phone number and college name to enter buyer or seller mode.
  - *Why*: Directly aligns with user clarification request (`from phone no only without otp`) while maintaining session continuity.
- **Private In-App Messaging**:
  - *Approach*: Buyers communicate with sellers through an in-app chat drawer rather than exposing personal numbers publicly, keeping student privacy intact.
- **Admin Password Gate (`1234`)**:
  - *Approach*: Modal PIN keypad with password verification `1234` before granting access to admin tools and fee controllers.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│               UniTrade App Root State                  │
│   (Active Portal: Gateway | Buyer | Seller | Admin)    │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
 ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
 │ Buyer Portal  │ │ Seller Portal │ │ Admin Portal  │
 │ - Search/Colg │ │ - Add Product │ │ - Password:   │
 │ - Filter/Cat  │ │ - Manage List │ │     "1234"    │
 │ - Cart & COD  │ │ - Boost (₹49) │ │ - Orders & Del│
 │ - Private Chat│ │ - Order Feed  │ │ - Price Setup │
 └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                           ▼
 ┌───────────────────────────────────────────────────────┐
 │               Persistent Local Storage                │
 │  - Products (boosted, active, sold, college, pricing) │
 │  - Orders (buyer, seller, delivery tier, COD status)  │
 │  - Campus Gigs (skills, price, hourly/per-deck)       │
 │  - Admin Config (boost fee: ₹49, local: ₹10, 70km:₹50)│
 │  - Notifications (simulated SMS inbox for seller)     │
 └───────────────────────────────────────────────────────┘
```

#### Core Data Entities

- `Product`: `id`, `title`, `description`, `category` (Textbooks, Calculators, Electronics, Shoes, Hostel Essentials), `price`, `condition` (Like New, Good, Fair), `college`, `sellerPhone`, `sellerName`, `imageUrl`, `isBoosted`, `boostedUntil`, `status` (`available` | `sold`), `createdAt`.
- `Order`: `id`, `items`, `buyerPhone`, `buyerName`, `deliveryAddress`, `college`, `deliveryType` (`pickup` | `local` | `regional_70km`), `deliveryFee`, `subtotal`, `totalAmount`, `paymentMode` (`COD`), `status` (`pending` | `out_for_delivery` | `delivered`), `sellerNotifiedForReview`, `createdAt`.
- `ServiceGig`: `id`, `providerName`, `providerPhone`, `college`, `title`, `category` (`presentation`, `graphic_design`, `tutoring`, `mentoring_chat`), `rate`, `description`, `rating`.
- `AdminSettings`: `boostFee` (default ₹49), `localDeliveryFee` (default ₹10), `regionalDeliveryFee` (default ₹50).
- `SMSNotification`: `id`, `recipientPhone`, `recipientRole`, `message`, `timestamp`, `isRead`.
