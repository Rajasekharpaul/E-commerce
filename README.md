## E-commerce App (Node/Express backend + React/Vite frontend)

### Overview
Full‑stack e‑commerce app:
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite), React Router v6, Axios, Context API

Features: product listing/details, per‑user cart (synced), checkout, auth (JWT), profile, orders, admin panel (products CRUD with category dropdown, list users), search with suggestions, category sorting, responsive hero.

### Monorepo Structure
```
backend/   # Express API
frontend/  # React app (Vite)
```

### Prerequisites
- Node.js 18+
- MongoDB connection (local or cloud)

### Setup
#### 1) Backend
```
cd backend
npm install
```
Create `.env` in `backend/`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
ACCESS_TOKEN_STRING=your_jwt_secret
```
Run backend:
```
npm run dev
```
API base: `http://localhost:5000/api`

#### 2) Frontend
```
cd ../frontend
npm install
```
Create `.env` in `frontend/`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Run frontend:
```
npm run dev
```
Open the shown URL (e.g., `http://localhost:5173/`).

### Endpoint Mapping
Backend routes:
- Auth: `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/current`
- Products: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Cart: `GET/POST /api/cart`, `PUT/DELETE /api/cart/:productId`
- Orders: `POST /api/order`, `GET /api/order`

Frontend expects:
- `VITE_API_BASE_URL` for Axios
- Login returns `{ accessToken, user }`
- Register expects `{ username, email, password }`
- Product create/update uses `title` (not `name`)
  
Per‑user cart (frontend ↔ backend):
- Local storage key: `cart:{userId}` when authenticated; `cart:guest` otherwise
- Sync endpoints: `GET /api/cart`, `POST /api/cart` `{ productId, quantity }`, `PUT /api/cart/:productId` `{ quantity }`, `DELETE /api/cart/:productId`

### Admin Access
- Requires `role: 'admin'` (or `isAdmin: true`).
- List users: `GET /api/users` (token + admin).
  
Products management (admin):
- Create via form with: title, price, image, category (dropdown), description, stock
- Update/Delete inline per product row in Admin → Products

### Frontend UX details
- Search: type to get top 5 suggestions; click to open product
- Product list: sorted by `category` then `name/title`
- Hero: full‑height section with background imagery and improved readability
  
### Troubleshooting
- Token missing: ensure successful login; check `localStorage.token` exists and is sent as Bearer.
- 404 on products create: send `title` instead of `name`.
- CORS: backend enables `cors()`; set `VITE_API_BASE_URL` to backend.
  
Windows PowerShell notes:
- Prefer `.env` files over inline env vars with `npm run dev`
- If setting env vars in session, use `$env:NAME='value'` before running commands

### Scripts
Backend: `npm run dev`, `npm start`
Frontend: `npm run dev`, `npm run build`, `npm run preview`

### License
ISC


