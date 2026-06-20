# EcoClean: Smart Waste Management System

EcoClean is a modern, high-fidelity, and mobile-responsive **Smart Waste Management System** designed to optimize municipal garbage collection using IoT smart containers, live coordinate mapping, gamified citizen rewards, and driver dispatch logistics. 

It is built as a Single Page Application (SPA) using React 19, Vite, Material-UI, Bootstrap 5, Leaflet Maps, and Recharts, with a mock database synced dynamically using `json-server`.

---

## 🌟 Key Features

### 🏢 Municipal Authority Dashboard
* **Control Center Analytics**: Monitor critical live indicators including total active bins, average fill levels across the district, connected vehicles, and pending citizen tickets.
* **Live IoT Map**: Renders an interactive Leaflet map indicating physical locations and color-coded fill statuses (Green/Yellow/Red) of smart bins clustered around **Coimbatore, Tamil Nadu**.
* **Complaint Dispatch Console**: Review overflow reports raised by citizens, geotagged evidence locations, and dispatch workers immediately.
* **Assignment Route Planner**: Sequence collection paths and dispatch custom routes to truck crews.
* **Vehicle Fleet Log**: Database tracking trucks, make, fuel classification (Electric/CNG/Diesel), active crew drivers, cargo weight, and load utilization rates.
* **Labor Management Board**: Registry displaying collection crew names, duty statuses, assigned routes, and performance ratings. Includes administrative **Staff Registration** forms to add workers.
* **Analytics Reports**: Multi-dimensional graphs detailing:
  * *Complaint Trends*: Area chart of total and resolved weekly tickets.
  * *Status Distribution*: Pie chart separating Pending vs In Progress vs Resolved reports.
  * *Fleet Utilization*: Bar chart highlighting load efficiency rates.

### 🌱 Eco-Citizen Portal (Public Hub)
* **Gamified Recycling Log**: Citizens log waste drop-offs (Plastic, Paper, Glass, Organic) to earn **Eco-Credits**.
* **Smart Bin Finder**: Map indicating nearby smart containers with category filters (General, Recyclable, Organic, Hazardous).
* **Jio-Geotagged Camera System**: citizens use their device camera to capture snapshot evidence of overflowing bins, instantly locking their exact GPS coordinates via the **Geolocation API** (Jio Geotags).
* **Gift Catalog Vouchers**: Trade accumulated Eco-Credits for coupons at retail business partners.

### 🚛 Collection Worker Portal (Driver Hub)
* **My Active Route**: Dynamic checklist showing assigned bins in sequential collection order.
* **Leaflet Route Navigation**: Map plotting paths and direction polylines across Coimbatore landmarks.
* **One-Click Emptying**: Drivers click "Mark Emptied" to reset bin fill statuses to 0% and dispatch confirmation alerts to the server.
* **Hazard Reporter**: Log blocked routes, accidents, or damaged containers.

---

## 🎨 Tech Stack & Architecture

* **Core Framework**: React 19, Vite 8, React Router DOM 7
* **CSS Frameworks**: Bootstrap 5 (responsive grid layout, utilities) and custom CSS stylesheets (`src/styles/custom.css`) for custom glassmorphism components and themed gradients.
* **UI Elements**: Material-UI (MUI v9) Dialog Modals, Select dropdowns, inputs, and chips.
* **Interactive Mapping**: Leaflet and React-Leaflet 5
* **Visual Graphing**: Recharts 3
* **State Management**: React Context (`src/context/AppContext.jsx`) managing authorization, data syncing, simulated sensors, and local cache fallbacks.
* **Backend Database**: Standard `json-server` REST database (port `3001`) with automatic fallback to browser `localStorage` if the backend server is offline.

---

## 📂 Project Structure

```bash
Smart-Waste-Management-System/
├── db.json                     # Seed database (Bins, Vehicles, Workers, Tickets)
├── index.html                  # Main entry point (Bootstrap CDN, Google Fonts)
├── package.json                # Project script specifications & modules
├── src/
│   ├── App.css
│   ├── App.jsx                 # Route configurations and layout wrappers
│   ├── main.jsx                # Application initialization
│   ├── index.css
│   ├── AuthPages/              # Authentication modules
│   │   ├── AuthLogin.jsx       # Admin portal login
│   │   ├── AuthRegister.jsx    # Admin portal registration block
│   │   ├── PublicLogin.jsx     # Citizen login
│   │   ├── PublicRegister.jsx  # Citizen account setup
│   │   ├── WorkerLogin.jsx     # Driver login
│   │   └── WorkerRegister.jsx  # Driver register
│   ├── components/
│   ├── context/
│   │   └── AppContext.jsx      # Global React Context state provider & Axios syncing
│   ├── pages/
│   │   ├── AuthorityDashboard.jsx   # Municipal Admin Control dashboard
│   │   ├── Home.jsx                 # Portal selection landing page
│   │   ├── PublicDashboard.jsx      # Citizen rewards & geotag report portal
│   │   └── WorkerDashboard.jsx      # Truck driver navigation & checklist
│   ├── router/
│   │   └── Router.jsx
│   ├── styles/
│   │   └── custom.css          # Glassmorphic and gradient headings stylesheet
│   └── utils/
└── vite.config.js
```

---

## ⚡ How to Setup & Run the Project

Follow these simple steps to run the application locally on your computer:

### 📋 Prerequisites
* Make sure you have **Node.js** (v18 or higher) and **npm** installed. You can check using:
  ```bash
  node -v
  npm -v
  ```

---

### 🛠️ Step-by-Step Launch Guide

#### **Step 1: Install Node Dependencies**
Open your terminal inside the root directory of the project and install all required modules:
```bash
npm install
```

#### **Step 2: Start the Mock Database Server (Backend)**
EcoClean coordinates state data dynamically using `json-server`. Start the backend service in a terminal:
```bash
npm run backend
```
> ℹ️ *This launches the mock database API at `http://localhost:3001`.*

#### **Step 3: Start the Frontend Client (Vite)**
Open a **new separate terminal tab/window** in the project root directory and start the Vite client application:
```bash
npm run dev
```
Once started, the terminal will show a link. Click it or open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

> [!TIP]
> **💡 Hybrid Offline / Fallback Mode**
> If you cannot start `json-server` (or if it is shut down), the application detects this instantly on mount and automatically activates **Local Fallback Mode**. The app will read/write state directly inside your browser's `localStorage` so you can still test all dashboards, register staff, file geotagged camera complaints, and redeem reward coupons offline!

---

## 🔑 Pre-Seeded Portals & Credentials

Use the following accounts to explore the ecosystem:

| Portal | Email Address | Password | Key Interactions |
| :--- | :--- | :--- | :--- |
| **Municipal Authority** | `admin@municipal.gov` | `admin123` | Control overview, Dispatch routes, Register staff & vehicles, View charts |
| **Citizen Hub** | `citizen@eco.com` | `citizen123` | Geotag complaints, Use camera simulator, Log recycling, Claim vouchers |
| **Collection Crew** | `worker@eco.com` | `worker123` | View navigation route, Reset container fill levels, Log road hazards |

---

## 📍 Coimbatore Mapping Centroids

All coordinate systems are centered on Coimbatore, Tamil Nadu, India (`[11.0168, 76.9558]`) with pre-seeded smart containers at:
* **BIN-01**: Gandhipuram Cross Cut Road
* **BIN-02**: RS Puram DB Road
* **BIN-03**: Peelamedu Avinashi Road
* **BIN-04**: Town Hall Main Area
* **BIN-05**: Race Course Walking Path
* **BIN-06**: Ukkadam Bus Stand
