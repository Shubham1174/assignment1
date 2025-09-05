# Product Catalog App (Node + Express + MongoDB + React)
Deployment (single host)
1) Build frontend: from `backend` run `npm run build:frontend`.
2) Set environment variables for backend: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none`.
3) Start backend: `npm start`. Backend serves `frontend/dist` and `/api` routes.
A simple full-stack product catalog with authentication, role-based access control, product CRUD, cart, and orders.

## Features
- JWT auth with HttpOnly cookies; roles: admin, customer
- RBAC enforced on backend and frontend route guards
- Products: create/read/update/delete (admin); public listing and detail
- Orders: customers place orders; admins view all; totals auto-calculated
- Validation (express-validator), centralized error handling, CORS
- Clean modular structure: routes, controllers, models, middleware

## Project Structure
```
backend/
  src/
    config/        # db connection
    controllers/   # auth, product, order
    middleware/    # auth, error handler
    models/        # User, Product, Order
    routes/        # /auth, /products, /orders, /health
    server.js
frontend/
  src/
    pages/         # Login, Register, Products, ProductDetail, Cart, Orders, AdminProducts
    store/         # auth, cart (zustand)
    api/           # axios client
    hooks/         # AuthGuard
    App.jsx, main.jsx, index.css
```

## Prerequisites
- Node.js 18+
- npm
- MongoDB (Atlas recommended, or local Docker)
- Git

## Quick Start
1) Clone
```bash
git clone https://github.com/Shubham1174/assignment1.git
cd assignment1
```

2) Backend
```bash
cd backend
copy .env.example .env   # Windows
# or: cp .env.example .env

npm install
npm run dev
```
Edit `.env` and set your `MONGODB_URI` (Atlas SRV is recommended).

3) Frontend
```bash
cd ../frontend
# create .env
# Windows PowerShell
Set-Content -Path .env -Value "VITE_API_BASE=http://localhost:5000/api`n"
# or: echo VITE_API_BASE=http://localhost:5000/api > .env

npm install
npm run dev
```
Open `http://localhost:5173`.

## Environment Variables
### backend/.env
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/product_catalog?retryWrites=true&w=majority
JWT_SECRET=replace_me_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
```

### frontend/.env
```env
VITE_API_BASE=http://localhost:5000/api
```

## API Reference
Base URL: `http://localhost:5000/api`

### Auth
- POST `/auth/register`  { name, email, password, role: 'admin' | 'customer' }
- POST `/auth/login`     { email, password }
- GET  `/auth/me`        (requires auth)
- POST `/auth/logout`    (requires auth)

### Products
- GET  `/products`                public
- GET  `/products/:id`            public
- POST `/products`                admin only
- PUT  `/products/:id`            admin only
- DELETE `/products/:id`          admin only

Example (admin, Bearer token):
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pen","description":"Blue pen","price":1.99,"category":"Stationery"}'
```

### Orders
- POST `/orders`                   customer only
- GET  `/orders`                   admin → all orders; customer → own orders
- GET  `/orders/:id`               authorized for admin or owner
- PUT  `/orders/:id/status`        admin only, status in: `pending|shipped|cancelled`

Example (customer):
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"products":[{"productId":"<PRODUCT_ID>","quantity":2}]}'
```

## Frontend Routes
- `/` products list (public)
- `/product/:id` product detail (public)
- `/login`, `/register` (public)
- `/cart` (customer only)
- `/orders` (customer and admin)
- `/admin/products` (admin only; add, edit, delete)

## Using MongoDB Atlas
- Resume your cluster → add your current IP in Network Access
- Create a DB user (username/password), copy SRV string
- Put SRV in `backend/.env` as `MONGODB_URI`

Alternative: local Mongo via Docker
```bash
docker run -d -p 27017:27017 --name mongo mongo:6
```

## Scripts
Backend
```bash
npm run dev   # start with nodemon
npm start     # start without nodemon
node src/smoke.js  # quick E2E smoke test
```
Frontend
```bash
npm run dev
npm run build
npm run preview
```

## Notes
- Auth uses HttpOnly cookie for the app; a JWT is also returned to support API tools/tests.
- Validation errors return 400 with details; 401/403 for auth/role issues; 404 for missing resources.

## License
MIT
