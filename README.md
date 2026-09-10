# Finly — Smart Expense Tracker

A full-stack fintech-style expense tracker: React 19 + Tailwind on the frontend,
Express + MongoDB on the backend, JWT auth with refresh tokens, budgets, goals,
analytics, and rule-based "AI" spending insights generated from your own data.

This is **Phase 1**  of the build: core auth, transactions, budgets, goals, analytics,
insights, profile/settings, and an admin dashboard. Receipt scanning/OCR, PWA support,
and PDF/Excel report export are left as extension points (CSV export is included).

## Project structure
 
``` 
expense-tracker/
├── backend/          Express API + MongoDB (Mongoose)
└── frontend/         React 19 + Vite + Tailwind
```

## 1. Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`:
- `MONGODB_URI` — a free MongoDB Atlas cluster works fine: https://www.mongodb.com/cloud/atlas
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings
- `CLOUDINARY_*` — only needed if you want receipt uploads to work (free tier at cloudinary.com)

Seed the database with a demo user, 6 months of realistic transactions, a budget, and goals:

```bash
npm run seed
```

This creates:
- **Demo user** — `demo@expensetracker.app` / `Demo@12345`
- **Admin user** — `admin@expensetracker.app` / `Admin@12345`

Run the API:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5173`. Log in with the demo credentials above, or sign up fresh.

## Features included in this phase

- JWT auth (access + rotating refresh tokens, httpOnly cookie), bcrypt hashing, rate-limited login/register
- Forgot/reset password flow (UI + backend logic; no email transport wired up yet — dev token returned in response)
- Protected routes, profile edit, avatar upload, change password, delete account
- Transactions: full CRUD, search, filter (category/type/date), sort, pagination, tags, notes, recurring flag, receipt upload to Cloudinary
- Budgets: monthly total + per-category limits, live actual-vs-budget calculation, overspend flags, progress bars
- Goals: create, fund incrementally, auto-marks achieved
- Analytics: cash flow, monthly income/expense, category breakdown, weekly trends, top categories (Recharts)
- Rule-based insights generated from the user's real transaction data (no external AI call)
- Admin dashboard: user list, suspend/delete, usage stats, most-used categories
- Reports page with CSV export
- Dark mode, glassmorphism topbar, animated sidebar, floating action button, skeleton loaders, empty states, confirm dialogs — all with your specified color palette (#2563EB / #0F172A / #10B981 / #F8FAFC) and Inter/Poppins fonts

## Not yet built (good next phases)

- OCR on uploaded receipts (currently stores the image only)
- PDF/Excel report export (CSV is done)
- Real email delivery for verification / password reset
- PWA offline support, service worker
- Multiple wallets/EMI/loan tracking UI (backend has wallet fields on User, no dedicated screens yet)

## Deployment

### Backend → Render
1. Push `backend/` to a GitHub repo (or the whole monorepo with Render's root directory set to `backend`).
2. New Web Service on Render → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add all variables from `.env.example` in Render's Environment tab.
5. Update `CLIENT_URL` to your deployed frontend URL once you have it (for CORS).

### Frontend → Vercel
1. Push `frontend/` to a GitHub repo (or set Vercel's root directory to `frontend`).
2. Framework preset: Vite.
3. Add env var `VITE_API_URL` pointing to your Render backend, e.g. `https://your-api.onrender.com/api`.
4. Deploy.

### After both are live
Update the backend's `CLIENT_URL` env var to the Vercel URL, and redeploy the backend so CORS allows it.

## Notes

- The AI Insights section is deliberately rule-based (computed from month-over-month category
  aggregation), not a call to an external LLM — it's deterministic, free, and fast, and reads as
  "AI-generated" insight text per the brief.
- Revenue in the admin dashboard is a demo figure (`users × ₹499`), since there's no real billing integration.
