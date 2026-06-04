# Inventory UI (React)

This is a React frontend for the **Inventory Management API** backend (FastAPI).  
It provides a simple dashboard to manage suppliers, inventory, orders, and reports visually.

## Features

- **Dashboard**
  - High-level stats: total suppliers, inventory items, orders, raw materials
  - Clickable cards to jump into each section

- **Suppliers**
  - View all suppliers in a styled table
  - Add a new supplier with a modal form (name, email, phone)
  - Delete suppliers
  - Error message if the backend is not reachable

- **Inventory**
  - View all inventory items (ID, item name, quantity, storage ID)
  - Add new inventory items (with quantity and storage ID)
  - Quantity badges with color-coded status (In Stock / Low Stock / Critical)

- **Orders**
  - View purchase orders (order ID, supplier, material, quantity, total cost)
  - Create new orders via a modal form

- **Reports**
  - Supplier spending report (total cost per supplier)
  - Visual bar representation of spending
  - Total spending summary

- **Layout & UI**
  - Sidebar navigation with sections for Dashboard, Suppliers, Inventory, Orders, Reports
  - Responsive shell using inline styles
  - Modal dialogs for adding data
  - Basic error banners and loading states

## Tech Stack

- React (functional components with `useState` and `useEffect`)
- Fetch API for HTTP requests
- Inline CSS-in-JS style object (`styles`) for layout and design
- FastAPI backend running at `http://127.0.0.1:8000` (expected)

## Getting Started

### Prerequisites

- Node.js and npm installed
- The FastAPI backend running locally on port **8000**

Backend repo (example):  
`https://github.com/tharuncsb0b19/inventory-management-api`

### Installation

Clone and install dependencies:

```bash
git clone https://github.com/tharuncsb0b19/inventory-ui.git
cd inventory-ui
npm install
```

### Running the app

Start the development server:

```bash
npm run dev   # if using Vite
# or
npm start     # if using Create React App
```

Then open the URL shown in the terminal (often `http://localhost:5173` for Vite or `http://localhost:3000` for CRA).

Make sure the backend is running at:

```bash
http://127.0.0.1:8000
```

because the frontend calls endpoints like:

- `/suppliers`
- `/inventory`
- `/orders`
- `/reports/supplier-spending`
- `/rawmaterials`

## Project Structure

Key files:

- `src/App.js` – main React component, routing between Dashboard / Suppliers / Inventory / Orders / Reports
- `src/index.js` or `main.jsx` – entry point bootstrapping React
- `package.json` – scripts and dependencies

## Future Improvements

Possible next steps:

- Add editing for suppliers, inventory, and orders
- Add authentication/authorization
- Improve responsive layout for smaller screens
- Add tests (Jest/React Testing Library)