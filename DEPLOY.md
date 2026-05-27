# Deployment Guide — Lifestyle Collection System

A **split** deployment: Frontend (React/Vite) on **Vercel**, Backend (Express) on **Render**, Database (PostgreSQL) on **Supabase**, images on **Cloudinary**.

```
[ Browser ] --> [ Vercel (static React) ] --HTTPS /api--> [ Render (Express) ] --> [ Supabase Postgres ]
                                                                  |
                                                                  +--> [ Cloudinary (images) ]
```

Follow this order: **Supabase → migrate locally → GitHub → Render → Vercel → connect**

---

## Prerequisites
- Accounts on [Supabase](https://supabase.com), [Render](https://render.com), [Vercel](https://vercel.com), [Cloudinary](https://cloudinary.com), [GitHub](https://github.com) (all have a free tier)
- Git installed locally

---

## Step 1 — Create the database on Supabase
1. Create a new project → set a **Database Password** (save it)
2. Go to **Project Settings → Database → Connection string → the "Prisma" / "URI" option**
3. Copy two values (replace `[YOUR-PASSWORD]` with the password you set):
   - **Transaction pooler** (port `6543`) → use as `DATABASE_URL` (append `?pgbouncer=true` — required so Prisma disables prepared statements through PgBouncer)
   - **Session pooler / Direct** (port `5432`) → use as `DIRECT_URL`

   Both use the host `...pooler.supabase.com` (IPv4-capable, works with Render)

---

## Step 2 — Create the migration locally (important — do this before pushing)
Tables are created from the Prisma migration — generate the migration file before deploying.

```bash
cd server
# Put DATABASE_URL + DIRECT_URL (from step 1) into server/.env
npm install
npx prisma migrate dev --name init   # create the migration file + the tables on Supabase
npm run seed                          # add test accounts + sample data (once)
```

Verify that a `server/prisma/migrations/<timestamp>_init/` folder was created — this file **must be committed** (Render uses it on deploy).

> You can test locally first: `npm run dev` (server) + `npm run dev` (client), then try logging in / creating an item.

---

## Step 3 — Push to GitHub
```bash
# In the repo root (Lifestyle Collection System/)
git init
git add .
git commit -m "Prepare for deploy (Postgres + Cloudinary, split hosting)"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
The root `.gitignore` already excludes `node_modules`, `.env`, and `dist` — **secrets in `.env` will not be pushed to GitHub**.

---

## Step 4 — Backend on Render
1. **New → Web Service** → connect the GitHub repo
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. **Environment Variables** (Settings → Environment):
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Transaction pooler (6543, `?pgbouncer=true`) |
   | `DIRECT_URL` | Direct/session (5432) |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_ORIGIN` | (leave blank for now — set it in step 6) |
   | `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
   | `CLOUDINARY_API_KEY` | from Cloudinary |
   | `CLOUDINARY_API_SECRET` | from Cloudinary |
   | `GOOGLE_CLIENT_ID` | OAuth Client ID (see "Set up Google OAuth") — skip if not using Google login |

   > No need to set `PORT` — Render injects it, and `server.js` already reads `process.env.PORT`
4. **Create Web Service** → wait for the build → note the URL, e.g. `https://lcs-api.onrender.com`
5. Open `https://<backend>/api/health` — you should get `{"status":"ok",...}`

> The free tier "sleeps" after ~15 min of no requests → the first request after sleeping is slow (~50s, normal)

---

## Step 5 — Frontend on Vercel
1. **Add New → Project** → import the GitHub repo
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (build `npm run build`, output `dist` — auto)
3. **Environment Variables:**
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<backend>.onrender.com/api` (from step 4 — **must end with /api**) |
   | `VITE_GOOGLE_CLIENT_ID` | same OAuth Client ID as the backend — skip if not using Google login |
4. **Deploy** → note the URL, e.g. `https://lcs.vercel.app`

> `VITE_API_URL` is baked in at build time — if you change it later you must **Redeploy** on Vercel

---

## Step 6 — Connect the two sides (CORS)
1. Back in **Render → Environment** → set `CLIENT_ORIGIN = https://lcs.vercel.app` (the real Vercel domain — **no trailing `/`**)
2. Save → Render redeploys automatically

---

## Set up Google OAuth (for "Login with Google")
Skip this if you're not using Google login (the button is hidden when the env var is not set).
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → **OAuth consent screen** → External → fill in the basics (add test users or Publish)
2. **Credentials → Create Credentials → OAuth client ID → Web application**
3. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (dev)
   - `https://lcs.vercel.app` (the real Vercel domain)
   > The ID-token/GSI flow only uses JavaScript origins — **no redirect URI needed**
4. Copy the **Client ID** → use the **same value** for both:
   - `GOOGLE_CLIENT_ID` on Render (backend)
   - `VITE_GOOGLE_CLIENT_ID` on Vercel (frontend) → after setting it you must **Redeploy Vercel**

---

## Step 7 — Test in production
- Open the Vercel domain → log in with a seed account: `admin@demo.com` / `admin1234` (or `user@demo.com` / `user1234`)
- Create an item with an image → the image goes to Cloudinary and displays
- Search with lowercase, e.g. `espre` → finds "Espresso" (confirms case-insensitive)
- Delete an item → the image disappears from the Cloudinary Media Library
- (if Google is set up) Click **Login with Google** → logs in / creates an account automatically

---

## Troubleshooting
| Symptom | Cause / fix |
|---|---|
| **CORS error** when calling the API | `CLIENT_ORIGIN` on Render doesn't match the Vercel domain (no trailing `/`) — fix it and redeploy |
| **404** when refreshing an inner page (e.g. `/profile`) | Missing `client/vercel.json` (rewrites → index.html) — it's included, verify it was deployed |
| Frontend can't reach the API / calls localhost | `VITE_API_URL` is wrong or unset → set it correctly and **redeploy Vercel** |
| Render build fails at `migrate deploy` | No migration file (forgot to commit step 2), or wrong `DIRECT_URL` / DB password |
| `prisma migrate` hangs / can't connect | Use **DIRECT_URL (5432)** for migrate, not the 6543 pooler; check the password and the pooler host (IPv4) |
| **`prepared statement "sXX" does not exist`** at runtime | `DATABASE_URL` (6543 pooler) is missing `?pgbouncer=true` — add it; or point `DATABASE_URL` to the 5432 session pooler instead |
| Images don't upload | `CLOUDINARY_*` keys on Render are incomplete/wrong |
| Google button doesn't appear | `VITE_GOOGLE_CLIENT_ID` not set (after setting it, redeploy Vercel) |
| Google shows an error / popup closes instantly | The current domain isn't in Authorized JavaScript origins, or `GOOGLE_CLIENT_ID` differs between the two sides |
| Every first request is slow | Render free tier was asleep — normal, or upgrade / ping with a cron |

---

## Environment variables summary
**Render (backend):** `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`

**Vercel (frontend):** `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`
