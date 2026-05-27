# คู่มือ Deploy — Lifestyle Collection System

Deploy แบบ **split**: Frontend (React/Vite) บน **Vercel**, Backend (Express) บน **Render**, Database (PostgreSQL) บน **Supabase**, รูปภาพบน **Cloudinary**

```
[ Browser ] --> [ Vercel (static React) ] --HTTPS /api--> [ Render (Express) ] --> [ Supabase Postgres ]
                                                                  |
                                                                  +--> [ Cloudinary (images) ]
```

ทำตามลำดับนี้: **Supabase → migrate ในเครื่อง → GitHub → Render → Vercel → เชื่อมต่อ**

---

## สิ่งที่ต้องมีก่อน
- บัญชี [Supabase](https://supabase.com), [Render](https://render.com), [Vercel](https://vercel.com), [Cloudinary](https://cloudinary.com), [GitHub](https://github.com) (ทุกอย่างมี free tier)
- Git ติดตั้งในเครื่อง

---

## ขั้น 1 — สร้าง Database บน Supabase
1. สร้าง project ใหม่ → ตั้ง **Database Password** (จดไว้)
2. ไปที่ **Project Settings → Database → Connection string → ตัวเลือก "Prisma" / "URI"**
3. คัดลอก 2 ค่า (แทน `[YOUR-PASSWORD]` ด้วยรหัสที่ตั้ง):
   - **Transaction pooler** (พอร์ต `6543`) → ใช้เป็น `DATABASE_URL` (เติม `?pgbouncer=true` ถ้ายังไม่มี)
   - **Session pooler / Direct** (พอร์ต `5432`) → ใช้เป็น `DIRECT_URL`

   ทั้งคู่ใช้ host `...pooler.supabase.com` (รองรับ IPv4 ใช้กับ Render ได้)

---

## ขั้น 2 — สร้าง migration ในเครื่อง (สำคัญ ต้องทำก่อน push)
ตารางจะถูกสร้างจาก Prisma migration — โปรเจกต์นี้รีเซ็ต migration ใหม่สำหรับ Postgres แล้ว ต้อง generate ไฟล์ migration ก่อน deploy

```bash
cd server
# ใส่ DATABASE_URL + DIRECT_URL (จากขั้น 1) ลงใน server/.env
npm install
npx prisma migrate dev --name init   # สร้างไฟล์ migration + สร้างตารางบน Supabase
npm run seed                          # ใส่บัญชีทดสอบ + ข้อมูลตัวอย่าง (ครั้งเดียว)
```

ตรวจว่ามีโฟลเดอร์ `server/prisma/migrations/<timestamp>_init/` เกิดขึ้น — ไฟล์นี้ **ต้อง commit** (Render จะใช้ตอน deploy)

> ทดสอบในเครื่องก่อนได้: `npm run dev` (server) + `npm run dev` (client) แล้วลองล็อกอิน/สร้างไอเทม

---

## ขั้น 3 — ขึ้น GitHub
```bash
# ที่โฟลเดอร์ราก (Lifestyle Collection System/)
git init
git add .
git commit -m "Prepare for deploy (Postgres + Cloudinary, split hosting)"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
`.gitignore` ที่รากกัน `node_modules`, `.env`, `dist` ไว้แล้ว — **secret ใน `.env` จะไม่ขึ้น GitHub**

---

## ขั้น 4 — Backend บน Render
1. **New → Web Service** → เชื่อม GitHub repo
2. ตั้งค่า:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma migrate deploy`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. **Environment Variables** (Settings → Environment):
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Transaction pooler (6543, `?pgbouncer=true`) |
   | `DIRECT_URL` | Direct/session (5432) |
   | `JWT_SECRET` | สตริงสุ่มยาวๆ |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_ORIGIN` | (เว้นไว้ก่อน — ใส่ทีหลังในขั้น 6) |
   | `CLOUDINARY_CLOUD_NAME` | จาก Cloudinary |
   | `CLOUDINARY_API_KEY` | จาก Cloudinary |
   | `CLOUDINARY_API_SECRET` | จาก Cloudinary |
   | `GOOGLE_CLIENT_ID` | OAuth Client ID (ดู "ตั้งค่า Google OAuth") — ข้ามได้ถ้าไม่ใช้ Google login |

   > ไม่ต้องตั้ง `PORT` — Render ฉีดให้เอง และ `server.js` อ่าน `process.env.PORT` อยู่แล้ว
4. **Create Web Service** → รอ build เสร็จ → จด URL เช่น `https://lcs-api.onrender.com`
5. เปิด `https://<backend>/api/health` ควรได้ `{"status":"ok",...}`

> Free tier จะ "หลับ" หลังไม่มี request ~15 นาที → request แรกหลังหลับช้า ~50 วิ (ปกติ)

---

## ขั้น 5 — Frontend บน Vercel
1. **Add New → Project** → import GitHub repo
2. ตั้งค่า:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (build `npm run build`, output `dist` — auto)
3. **Environment Variables:**
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<backend>.onrender.com/api` (จากขั้น 4 — **ลงท้าย /api**) |
   | `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID เดียวกับฝั่ง backend — ข้ามได้ถ้าไม่ใช้ Google login |
4. **Deploy** → จด URL เช่น `https://lcs.vercel.app`

> ค่า `VITE_API_URL` ถูกฝังตอน build — ถ้าเปลี่ยนภายหลังต้อง **Redeploy** ฝั่ง Vercel ใหม่

---

## ขั้น 6 — เชื่อม 2 ฝั่ง (CORS)
1. กลับไป **Render → Environment** → ตั้ง `CLIENT_ORIGIN = https://lcs.vercel.app` (โดเมน Vercel จริง **ห้ามมี `/` ท้าย**)
2. Save → Render จะ redeploy อัตโนมัติ

---

## ตั้งค่า Google OAuth (สำหรับ "Login with Google")
ข้ามได้ถ้ายังไม่ใช้ Google login (ปุ่มจะไม่แสดงถ้าไม่ได้ตั้ง env)
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → **OAuth consent screen** → External → กรอกข้อมูลพื้นฐาน (เพิ่ม test users หรือ Publish)
2. **Credentials → Create Credentials → OAuth client ID → Web application**
3. **Authorized JavaScript origins** เพิ่ม:
   - `http://localhost:5173` (dev)
   - `https://lcs.vercel.app` (โดเมน Vercel จริง)
   > ID-token/GSI flow ใช้แค่ JavaScript origins — **ไม่ต้องตั้ง redirect URI**
4. คัดลอก **Client ID** → ใช้เป็น **ค่าเดียวกัน** ทั้ง:
   - `GOOGLE_CLIENT_ID` บน Render (backend)
   - `VITE_GOOGLE_CLIENT_ID` บน Vercel (frontend) → ตั้งแล้วต้อง **Redeploy Vercel**

---

## ขั้น 7 — ทดสอบ production
- เปิดโดเมน Vercel → ล็อกอินด้วยบัญชี seed: `admin@demo.com` / `admin1234` (หรือ `user@demo.com` / `user1234`)
- สร้างไอเทมพร้อมรูป → รูปขึ้น Cloudinary และแสดงผล
- ค้นหาด้วยตัวพิมพ์เล็ก เช่น `espre` → เจอ "Espresso" (ยืนยัน case-insensitive)
- ลบไอเทม → รูปหายจาก Cloudinary Media Library
- (ถ้าตั้ง Google) กดปุ่ม **Login with Google** → เข้าได้/สร้างบัญชีให้อัตโนมัติ

---

## Troubleshooting
| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| เรียก API แล้วโดน **CORS error** | `CLIENT_ORIGIN` บน Render ไม่ตรงโดเมน Vercel (อย่ามี `/` ท้าย) — แก้แล้ว redeploy |
| refresh หน้าใน (เช่น `/profile`) แล้ว **404** | ขาด `client/vercel.json` (rewrites → index.html) — มีให้แล้ว ตรวจว่าถูก deploy |
| frontend เรียก API ไม่ถึง / ยิงไป localhost | `VITE_API_URL` ผิดหรือไม่ได้ตั้ง → ตั้งให้ถูกแล้ว **Redeploy Vercel** |
| Render build fail ที่ `migrate deploy` | ไม่มีไฟล์ migration (ลืม commit ขั้น 2) หรือ `DIRECT_URL` ผิด/รหัสผ่าน DB ผิด |
| `prisma migrate` ค้าง/ต่อ DB ไม่ได้ | ใช้ **DIRECT_URL (5432)** สำหรับ migrate ไม่ใช่ pooler 6543; ตรวจรหัสผ่านและ host pooler (IPv4) |
| รูปอัปโหลดไม่ขึ้น | คีย์ `CLOUDINARY_*` บน Render ไม่ครบ/ผิด |
| ปุ่ม Google ไม่ขึ้น | ยังไม่ได้ตั้ง `VITE_GOOGLE_CLIENT_ID` (ตั้งแล้วต้อง redeploy Vercel) |
| Google ขึ้น error / popup ปิดทันที | โดเมนปัจจุบันไม่ได้อยู่ใน Authorized JavaScript origins หรือ `GOOGLE_CLIENT_ID` 2 ฝั่งไม่ตรงกัน |
| ทุก request ช้าครั้งแรก | Render free tier หลับ — ปกติ หรืออัปเกรด/ใช้ cron ping |

---

## สรุป Environment Variables
**Render (backend):** `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`

**Vercel (frontend):** `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`
