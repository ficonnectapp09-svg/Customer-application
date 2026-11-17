# Changelog

All notable changes to the Connect Mobile application are documented here.

## [Release] - 2026-11-17

### Fixed
- **Strict Indian Mobile Number Validation (`validation.ts`, `Login.tsx`, `JoinNow.tsx`, `CheckoutScreen.tsx`, `StayDetails.tsx`, `CategoryDetails.tsx`, `JobDetailsScreen.tsx`)**:
  - Centralized Indian mobile validation logic into `isValidIndianMobile(phone)` requiring 10 digits starting with [6-9].
  - Enforced strict validation across user registration, password reset, guest traveller/stay bookings, delivery address input, and job applications with standardized alert: *"Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9."*.

- **Universal Dark Mode Contrast & Notifications Legibility (`CustomerNotifications.tsx`, `HomeDashboard.tsx`, `CategoryDetails.tsx`)**:
  - Bound `CustomerNotifications.tsx` directly to `useThemeStore.isDark`, removing obsolete background color checks that forced dark text on dark containers.
  - Corrected contrast for Notification modal titles, descriptions, timestamps, and empty states.
  - Standardized review stars (`#F5B800`) and rating counters with dynamic contrast colors (`#0F172A` light / `#F8FAFC` dark).
  - Centered Category Details header title with `flex: 1, textAlign: 'center'` preventing action button truncation.

- **Stay Booking Capacity Limits & Order Enrichment (`StayDetails.tsx`, `orderStore.ts`)**:
  - Linked adult and child guest counters in `StayDetails.tsx` to property maximum capacity (`maxAllowedGuests`), disabling increment buttons when full and displaying capacity warning.
  - Fixed theme background and input border contrast for guest details cards in Dark Mode.
  - Enriched `POST /orders` payload for Stay bookings with `product_details`, `hotel_name`, `room_type`, and item arrays.
  - Refined order taxonomy normalization in `orderStore.ts` to ensure Stay bookings appear under **My Bookings** with status **"BOOKING RECEIVED"**.

- **GPS Route Tracking Layout & Simulation Control (`LiveTracking.tsx`)**:
  - Shifted `floatingEtaCard` from bottom to `top: 12` to eliminate overlap with `MapComponent.tsx`'s bottom metrics card.
  - Initialized live GPS simulation to inactive (`isLiveSimulating = false`) by default, adding an on-demand "Start GPS / GPS Active" toggle button.

- **Job Applicant Information Bullet Delimiter Parsing (`CustomerOrders.tsx`)**:
  - Replaced legacy bullet character split with multi-encoding regex `/[•·\u2022\u00b7]|â€¢/` to prevent mojibake and encoding corruption when extracting candidate education, experience, and resume filename from `order.customer_address`.

- **Category Catalog Subcategory & Dynamic Third-Level (Child Category) Hierarchy (`CategoryDetails.tsx`, `categoryService.ts`)**:
  - Implemented dynamic Level 3 child category derivation from backend taxonomy (`getCachedHierarchy()` & `SIDEBAR_DATA`) and live catalog items (`apiProducts`).
  - Added horizontal scroll pill row for Level 3 child categories under Level 2 subcategories (e.g. `[Air Cooler]`, `[TV]`, `[Ceiling Fan]` under `Electronics`; `[Sofa]`, `[Chair]`, `[Cot]`, `[Bean Bag]` under `Furniture`; `[Sanitary Plumbers]`, `[Water Supply Plumbers]` under `Plumbers`; `[Solar Technicians]`, `[Lineman]` under `Electrician`; `[Dosa]`, `[Idly]`, `[South Indian Meals]` under `South Indian`).
  - Implemented dynamic child category filtering in `displayedServices`, `draftProdDisplayedServices`, and `draftDnDisplayedServices` with strict non-empty and distinctive-keyword matching.
  - Ensured categories with 0 child categories (e.g. `Toys`, `Stationary`) gracefully hide the child pill row without empty space or layout shift.
  - Guaranteed accessibility compliance across both Light Mode (`#0F172A` selected pill with white text) and Dark Mode (`#F5B800` vibrant gold pill with dark text).

- **Category Catalog Subcategory Integrity (`Categories.tsx`, `CategoryDetails.tsx`)**:
  - Guaranteed subcategory chips for `Furniture` under Products, `Electrician` and `Plumbers` under Services, and `Groceries` / `Diary` under Daily Needs.
  - Added dedicated subcategory filters ensuring correct items are queried and rendered on chip selection.
  - Fixed Travel category navigation from `Categories.tsx` to open `CategoryDetails` with full vehicle listings instead of bypassing to product details.

### Verified
- **TypeScript Compilation**: `npx tsc --noEmit` completed with 0 errors.
- **Android Release Build**: `gradlew assembleRelease -x lint` completed successfully in 10m 54s; packaged `Customer-Mobile-Release.apk` (107.4 MB).
- **Emulator Verification**: Installed via `adb install -r` and verified on `emulator-5554`. Confirmed Dark Mode readability, Indian mobile rejection dialog, subcategory filters (Furniture, Electrician), and Travel booking sheets.

## [Unreleased] - 2026-10-31

### Fixed
- **Travel Filter Accuracy & Real Data Search (`travelData.ts` & `CategoryDetails.tsx`)**:
  - **Location Matching Accuracy**: Updated `matchesLocation` and `normalizeLocationName` to enforce tokenized word boundary matching and subdocument location parsing (`{ name, city, point }`), eliminating false positive substring matches.
  - **Dynamic Origin & Destination Options**: Removed hardcoded mock fallback cities (`Bangalore (Majestic 21:30)`, `Chennai (Koyambedu 06:00)`). Location pickers now dynamically extract distinct origins and destinations from active backend database records.
  - **Reactive Filter Memoization**: Added missing filter dependencies (`travelFrom`, `travelTo`, `travelType`, `travelDepartureTime`, `travelPriceRange`, `travelPassengers`, `dynamicVendorTravelItems`) to `displayedServices`'s `useMemo` dependency array in `CategoryDetails.tsx`.
  - **Strict Filter Enforcement**: Fixed `currentRouteBuses` and `draftBusDisplayedServices` logic to stop falling back to all travel listings when no route matches the customer's selection. Display proper empty state: `"No travel options found for your selected route and filters."`.
  - **Verified Routes**:
    - "From: Madurai" retrieves only Madurai departures (`Green Bus`). Unrelated listings (`Purple Bus`, `Zing Bus`) are strictly excluded.
    - "From: Madurai ➔ To: Salem" displays only `Green Bus`.
    - Routes with no matches (e.g., Salem ➔ Madurai) cleanly render the standard empty state.

- **Razorpay Production Integration & Mobile UI/UX Alignment (`RazorpayModal.tsx` & `razorpayService.ts`)**:
  - **Edge-to-Edge Safe Area Alignment**: Replaced iOS-only `SafeAreaView` with `useSafeAreaInsets` and `statusBarTranslucent={true}`, preventing top notch/status bar clipping and bottom Android gesture bar / navigation pill overlap on edge-to-edge Android devices (Pixel 9a).
  - **Production Architecture Parity**:
    - Dynamically evaluates production vs test keys (`keyId.startsWith('rzp_test_')`), displaying an emerald `"SECURE PAY"` badge in production mode.
    - Added authenticated customer detail prefill banner (`👤 Dhanush • 6379068721 • email`) matching the Customer Website experience.
    - Integrated backend order creation API (`/api/orders/create-razorpay-order`) with customer ID attribution and resilient client-side fallback.
    - Full end-to-end checkout, payment verification, and order confirmation verified on live Pixel 9a emulator.

- **Cart Price Parser Hardening (`CartModal.tsx`)**:
  - Fixed `TypeError: undefined is not a function` during `calculateTotal()` by safely checking whether `item.price` is already a numeric number before invoking string `.replace()`.

  - **Authoritative Taxonomy Normalization (`orderStore.ts` & `CustomerOrders.tsx`)**:
    - Fixed root cause of category misclassification where service bookings (e.g., `LINEMAN (Standard Service & Jet Wash)`) were incorrectly tagged as `STAY BOOKING` with check-in/check-out fields.
    - Eliminated heuristic waterfall flaws in `normalizeStoredOrderCategory` and `normalizeOrderCategory` that evaluated `Stay` properties before `Services` and mutated in-memory records.
    - Implemented strict category resolution prioritizing authoritative backend fields (`category`, `type`, `booking_type`, `order_type`) followed by exact taxonomy mapping.
    - Explicitly mapped Service bookings (`Services`, `Service`, `Home Services`, service keywords) to `'Services'`.
    - Explicitly mapped Stay bookings (`Stay`, `hotel`, `room`, `villa`, `resort`, `accommodation`) to `'Stay'`.
    - Explicitly mapped Travel bookings (`Travel`, `bus`, `transport`, `flight`, `train`, `cab`) to `'Travel'`.
  - **Dedicated Booking Card Layouts**:
    - **Service Booking Card (`renderServiceBookingCard`)**:
      - 1st: Highlighted Service Name (`LINEMAN (Standard Service & Jet Wash)`).
      - 2nd: Business / Vendor Name (`by <Business Name>`).
      - 3rd: Structured Booking Information (Booking ID, Booking Date, Scheduled Service Date, Actual Time Slot, Booking Status badge, Payment Status badge, Booking Amount).
      - 4th: Customer Information (Customer Name, Authorized Contact Number, Service Execution Address).
      - Integrated Service Start OTP / PIN card when present.
      - Zero Stay-specific fields (`Check-in`, `Check-out`, Room Type, Guests) rendered.
    - **Stay Booking Card (`renderStayBookingCard`)**:
      - 1st: Stay / Property Name highlighted.
      - 2nd: Business / Vendor Name.
      - 3rd: Booking Information (Booking ID, Check-in Date & Time, Check-out Date & Time, Room Type, Guests Count, Booking Status badge, Payment Status badge, Total Amount).
      - 4th: Customer Information (Customer Name, Authorized Contact Number, Property Address).
    - **Travel Booking Card (`renderBusTicketCard`)**:
      - Operator/Listing Name, Route (Departure/Destination), Journey Date & Time, Passenger Count, Seat Details, Status, Payment, Total Amount.
  - **Dedicated Modal Sheets in Customer Orders**:
    - Built category-specific sheets for Service Bookings, Stay Reservations, and Travel Tickets with contextual details (e.g., technician & OTP for Services, room allotment & Govt photo ID notice for Stays, seat & route details for Travel).
  - **Full-Card Clickability & Tab/Status Filters**:
    - Enabled tapping anywhere on the card surface to open full booking details.
    - Filter pills (All, Services, Stay, Travel) and status filters operate cleanly with zero cross-contamination.

