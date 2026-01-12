# Modern Laravel E-Commerce Platform

A high-performance, full-stack e-commerce solution built with a **Laravel** backend and **React** frontend. This project features a robust hybrid search engine, secure payments via Stripe, and a modern, responsive UI.

## 🚀 Key Features

### 🛒 E-Commerce Functionality
- **Product Management**: Browse collections, view details, and manage inventory.
- **Shopping Cart & Wishlist**: Persistent cart state and wishlist functionality.
- **Stripe Payments**: Secure checkout flows with `PaymentIntent` integration.
- **Order Tracking**: Users can view order history and shipping status.

### 🔍 Advanced Search Engine
- **Hybrid Architecture**: Switches between **PostgreSQL Full-Text Search** and a custom **In-Memory Engine**.
- **Performance**: Sub-20ms latency for autocomplete and suggestions.
- **Features**: Typo-tolerance, relevance scoring, and highlighting.

### 🛠 Tech Stack
**Backend (`/backend`)**
- **Framework**: Laravel 12 API
- **Database**: PostgreSQL (Neon Tech)
- **Cache/Queue**: Redis (Upstash)
- **Search**: `tsvector` + GIN Index / Custom In-Memory
- **Storage**: Cloudinary (Image optimization)

**Frontend (`/frontend`)**
- **Framework**: React + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Context API
- **Routing**: React Router

---

## 🛠 Local Development Setup

### Prerequisites
- PHP 8.2+ & Composer
- Node.js 20+ & NPM
- PostgreSQL & Redis

### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env  # Configure DB, Stripe, Redis keys
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

---

## ☁️ Deployment

This project is structured as a **Monorepo** designed for split deployment:

### Backend (Render)
- **Method**: Docker
- **Root Directory**: `backend`
- **Build Command**: Uses included `Dockerfile`

### Frontend (Vercel)
- **Method**: Vite
- **Root Directory**: `frontend`
- **Routing**: Handled via `vercel.json`

---

## 🧪 Testing & Quality
- **Stripe Integration**: Sandbox mode enabled for safe payment testing.
- **Search**: Run `php artisan migrate` to ensure search indexes are generated.

## 📄 License
MIT License
