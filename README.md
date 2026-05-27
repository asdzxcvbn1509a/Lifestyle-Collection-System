# Lifestyle Collection System

A full-stack web app for keeping a "lifestyle collection" — users create **Categories**, store **Items**, mark **Favorites**, search, view stats, and an **Admin** manages users / system settings. Covers Use Cases UC-01 through UC-10.

## Tech stack
| Part | Technology |
|---|---|
| Frontend | React 18, Vite 5, JavaScript, Tailwind CSS 3, React Router 6, TanStack Query 5, React Hook Form, Recharts, lucide-react, sonner |
| Backend | Node.js, Express 5, Prisma 6, JWT (jsonwebtoken), bcryptjs, Zod 4, multer, Cloudinary |
| Database | PostgreSQL (Supabase) |
| Image storage | Cloudinary |

## Use Case → feature
| UC | Name | Where |
|---|---|---|
| UC-01 | Register | `/register` page, `POST /api/auth/register` |
| UC-02 | Login | `/login` page, `POST /api/auth/login` (JWT) |
| UC-03 | Manage profile | `/profile` page, `PUT /api/users/me`, `/me/password` |
| UC-04 | Save data (add category/item) | Home + Category page, `POST /api/categories`, `/items` |
| UC-05 | Edit data | Edit button on cards, `PUT /api/categories/:id`, `/items/:id` |
| UC-06 | Delete data | Delete + confirm, `DELETE /api/categories/:id`, `/items/:id` |
| UC-07 | Search | Navbar search + within a category, `GET /api/items?q=` |
| UC-08 | View stats | `/stats` page (Recharts), `GET /api/stats` |
| UC-09 | Manage users (admin) | `/admin/users` page, `GET/POST/PUT/DELETE /api/admin/users` |
| UC-10 | Manage system (admin) | `/admin/settings` page, `GET/PUT /api/admin/settings` |
| (extra) | Favorites | `/favorites` page, `PATCH /api/items/:id/favorite` |

## Prerequisites
- Node.js 18+ and npm
- A PostgreSQL database — [Supabase](https://supabase.com) (free) recommended, or local Postgres
- A Cloudinary account (free) for image storage — you need the cloud name, API key, and API secret

## Setup and run

### 1) Backend (`server/`)
```bash
cd server
npm install
# Edit server/.env -> set DATABASE_URL + DIRECT_URL (Supabase) and the Cloudinary keys
npx prisma migrate dev   # create the database tables
npm run seed             # add test accounts + sample data
npm run dev              # API at http://localhost:4000
```

Example `server/.env`:
```
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

> For production deployment (Vercel + Render + Supabase) see the steps in [DEPLOY.md](DEPLOY.md)

### 2) Frontend (`client/`)
```bash
cd client
npm install
npm run dev              # opens http://localhost:5173
```
Vite proxies `/api` to the backend (`:4000`) automatically (no CORS setup needed in dev); images are served directly from Cloudinary.

## Test accounts (from seed)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.com` | `admin1234` |
| User | `user@demo.com` | `user1234` |

## Project structure
```
server/
  prisma/schema.prisma      # User, Category, Item, SystemSetting models
  prisma/seed.js            # test accounts + sample data + default system settings
  src/
    app.js, server.js
    routes/ controllers/    # auth, users, categories, items, stats, admin
    middleware/             # requireAuth/requireAdmin, validate(zod), upload(multer memory), error
    lib/                    # prisma, jwt, hash, settings, serialize, cloudinary
client/
  src/
    api/                    # axios + endpoint functions
    auth/                   # AuthContext, ProtectedRoute, AdminRoute
    components/             # Navbar, cards, modals, IconPicker, RatingStars ...
    hooks/                  # useCategories, useItems, useStats, useAdmin
    pages/                  # Login, Register, Home, Category, Favorites, Search, Stats, Profile, admin/*
```

## Available scripts
**server:** `npm run dev` | `npm start` | `npm run migrate` | `npm run seed` | `npm run studio` (Prisma Studio) | `npm test`
**client:** `npm run dev` | `npm run build` | `npm run preview` | `npm test`

## Technical notes
- Uses **Prisma 6** (not 7) because Prisma 7 forces a `prisma.config.ts` + driver adapter, which doesn't fit a plain-JavaScript project.
- Uses **Express 5** (`req.query` is read-only — `validate` stores the parsed result in `req.validatedQuery`) and **Zod 4**.
- Every query is owner-scoped; users only see their own data, except admins.
- JWT is stored in `localStorage` and attached via an axios interceptor; admin routes are protected by `AdminRoute`.
- Images (items + avatars) are stored on **Cloudinary** — multer receives files in memory then streams them to Cloudinary, the `public_id` is kept in the DB (`imagePublicId`/`avatarPublicId`) so images can be deleted on replace/remove, and they are delivered with `f_auto/q_auto` for automatic optimization.
- Supports **Login with Google** (Google Identity Services — ID token flow): the frontend sends the credential to `POST /api/auth/google`, the backend verifies it with `google-auth-library` and issues its own JWT; accounts are auto-linked by email / created automatically. Requires `GOOGLE_CLIENT_ID` (server) + `VITE_GOOGLE_CLIENT_ID` (client).
