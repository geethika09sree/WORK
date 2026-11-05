# WorkSphere

Employee management system: React + Vite + Redux Toolkit (RTK Query) frontend, Express + MongoDB backend, JWT auth.

## Local development

```bash
# backend
cd backend && cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install && npm run dev            # http://localhost:5000

# frontend (new terminal, repo root)
cp .env.example .env
npm install && npm run dev            # http://localhost:5173
```

## How auth works
1. `POST /api/auth/login` returns a signed JWT (HS256, `JWT_EXPIRES_IN`, default 1d).
2. The frontend stores it in the Redux `auth` slice (persisted to localStorage) and `apiSlice` sends it as `Authorization: Bearer <token>`.
3. The backend `protect` middleware verifies it; `authorizeRoles` enforces Admin / HR / Employee access.
4. On any 401 the frontend logs out automatically and clears the RTK Query cache.

## Third-party API
Public holidays come from [Nager.Date](https://date.nager.at) (no key needed). The browser calls `GET /api/external/holidays`, and the backend fetches and caches the provider response for 24h.

## Deploying to Vercel
Deploy as **two Vercel projects** from the same repo.

**1. Backend** – Import repo, set *Root Directory* = `backend`. Environment variables:

| Name | Value |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string (Atlas Network Access must allow `0.0.0.0/0` for Vercel) |
| `JWT_SECRET` | long random string (e.g. `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `1d` |
| `CLIENT_ORIGINS` | your frontend URL, e.g. `https://worksphere.vercel.app` (no trailing slash; comma-separate several) |

**2. Frontend** – Import repo, *Root Directory* = repo root (framework: Vite). Environment variable:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://<your-backend>.vercel.app/api` |

`VITE_*` values are baked in at build time, so redeploy the frontend after changing it.

**3. Create the first admin** – run once from your machine with `backend/.env` pointing at the production database: `node createAdmin.js` (note: it *updates* an existing Admin user; see below).
