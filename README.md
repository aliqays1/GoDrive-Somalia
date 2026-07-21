# 🚗 GoDrive Somalia — Production Car Rental Management System

[![GoDrive Somalia](https://img.shields.io/badge/GoDrive-Somalia%20Car%20Rental-00A859?style=for-the-badge&logo=car&logoColor=white)](https://github.com/cabdikariinraage58-dot/godrive-somalia)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**GoDrive Somalia** is a commercial-grade, full-stack Car Rental Management System engineered specifically for Somalia. The platform supports 5 distinct role portals (Customer, Guard, Employee, Admin, Auditor), dynamic pricing for rentals (daily, weekly, monthly up to 4 months max initial booking), pre/post-rental 360° video & photo evidence upload, digital legal contracts, QR-code boarding passes, Somali mobile money (EVC Plus, Zaad, Sahal) alongside PayPal & Visa/MasterCard, and automated expiration reminders.

---

## 🌟 Key Features & Role Portals

### 1. 👤 Customer Portal (16 Sequential Steps)
- **Account Registration & Document Verification**: Upload Driver's License & Passport / National ID.
- **Fleet Catalog & Multi-Filters**: Search and filter by Body Type (*SUV, Sedan, Pickup, Luxury, Economy*), Transmission, Fuel Type, Seats, AC, and Station Location.
- **Interactive Vehicle Details**: Multi-photo gallery, **360° Walkaround MP4 Video**, availability calendar, customer reviews, and rental rules.
- **Dynamic Price Calculator**: Itemized rate breakdown for 1 day to 4 months (120 days) with long-term discounts (up to 15%), 5% Somali tax, comprehensive insurance ($25/day), and refundable security deposit ($100).
- **Digital Legal Agreement**: Read formal Somali commercial transport agreement and sign digitally.
- **Multi-Gateway Payment Drawer**: **PayPal**, **Visa & MasterCard**, **EVC Plus (*770#)**, **Zaad (*880#)**, and **Sahal (*899#)**.
- **QR Boarding Pass (`SMR-2026-XXXXX`)**: Downloadable/printable QR code pass for parking gate release.
- **Pre-Drive 360° Evidence Upload**: Upload 360° walkaround video, 4-angle photos, fuel gauge level %, and existing scratch notes.
- **Active Rental Dashboard**: Real-time countdown timer, 7-day / 3-day / 24-hour expiration alert reminders, 1-click rental renewal modal, roadside emergency dispatch, and authenticated PDF tax invoice downloader.

---

### 2. 🛡️ Guard Portal (`/guard-gate`)
- **Login Credentials**: `guard@godrive.so` / `guard123`
- **Today's Expected Arrivals**: Real-time queue of arriving customers, assigned car, parking bay, and arrival time.
- **Verification & Handover Check**: Scan QR code or enter pass number ➔ Displays customer photo, name, assigned car, parking bay ➔ Verify physical Driver's License & Passport/ID ➔ Press **"Approve Pickup"** (logs timestamp, Guard ID, location).
- **Vehicle Return Entry**: Check-in returning vehicles and notify Employee staff for inspection.

---

### 3. 🔑 Employee Portal (`/employee`)
- **Login Credentials**: `employee@godrive.so` / `employee123`
- **Operational Handover**: Key handover, vehicle cleaning check, pre-drive evidence review.
- **Return Inspection Logger**: Record returned odometer mileage (KM), fuel level %, document new scratches/damage with photos & estimated repair cost, calculate deposit refund.

---

### 4. ⚙️ Executive Admin Portal (`/admin`)
- **Login Credentials**: `admin@godrive.so` / `admin123`
- **Regional Somalia Hubs Breakdown**: Live vehicle tracking across Mogadishu Aden Adde Airport, Hargeisa Egal, Garowe, and Kismayo stations.
- **Fleet Management**: CRUD operations for fleet, set dynamic rates, upload photos and 360° video URLs.
- **Reservation & Parking Assignment**: Assign vehicles, parking bays, and staff to customer bookings.
- **Employee Management**: Create staff accounts and assign roles (*Admin, Auditor, Employee, Guard*).
- **System Settings Editor**: Configure tax rates (%), security deposits ($), daily insurance rates, and email notification templates.
- **CSV & PDF Export**: Export comprehensive operational and revenue reports.

---

### 5. 🔒 Compliance Auditor Portal (`/auditor`)
- **Login Credentials**: `auditor@godrive.so` / `auditor123`
- **Strictly Read-Only Access**: View-only compliance dashboard.
- **Financial Reconciliation**: Match Reservations ➔ Payments ➔ Invoices ➔ Refunds.
- **Security Anomaly Alert Center**: Instant alerts for unauthorized price edits, manual refunds, failed payment spikes, or vehicle deletions.
- **Immutable Audit Trail**: Inspect all system activities with Timestamp, Performer, IP Address, and Action details.

---

## 🇸🇴 Popular Somalia Fleet Catalog

- **Toyota Land Cruiser V8 VX-R 2024** (Mogadishu Airport / VIP 4x4)
- **Toyota Land Cruiser Prado TX-L 2023** (Hargeisa & Garowe All-Terrain)
- **Toyota Hilux GR Sport 4x4 Double Cab 2024** (Security & Cargo)
- **Nissan Patrol Super Safari 4.8L V6** (Highway & Road Trips)
- **Toyota Mark X Executive 350S** (City Sedan)
- **Toyota Noah 8-Seater Minivan** (Family & Group Travel)
- **Hyundai Santa Fe AWD** (Family SUV)
- **Toyota Vitz RS** (Economy City Car)

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Light Luxury Theme `#F8FAFC`), Framer Motion, Lucide Icons, React Router DOM (v6), TanStack Query, Canvas-Confetti.
- **Backend**: Node.js, Express.js, JWT Authentication, Bcryptjs, PDFKit, QRCode, Mongoose.
- **Database**: MongoDB Atlas (with automated in-memory store fallback mode).
- **Localization**: English (`en`) & Af-Soomaali (`so`) dynamic language switcher.

---

## 🚀 How to Run locally

### 1. Start Backend Server:
```powershell
cd backend
node server.js
```
*Backend runs on `http://localhost:5000`*

### 2. Start Frontend Server:
```powershell
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔄 Syncing Changes to GitHub

To push future updates to the repository:
```powershell
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "Update GoDrive Somalia features"
& "C:\Program Files\Git\cmd\git.exe" push
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.