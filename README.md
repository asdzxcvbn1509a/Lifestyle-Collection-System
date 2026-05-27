# Lifestyle Collection System

เว็บแอปแบบ full-stack สำหรับเก็บ "คอลเลกชันไลฟ์สไตล์" — ผู้ใช้สร้าง **หมวดหมู่ (Category)** เก็บ **ไอเทม (Item)** ติด **รายการโปรด (Favorite)** ค้นหา ดูสถิติ และมี **ผู้ดูแลระบบ (Admin)** จัดการผู้ใช้/ตั้งค่าระบบ ครอบคลุม Use Case UC-01 ถึง UC-10

## Tech stack
| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 18, Vite 5, JavaScript, Tailwind CSS 3, React Router 6, TanStack Query 5, React Hook Form, Recharts, lucide-react, sonner |
| Backend | Node.js, Express 5, Prisma 6, JWT (jsonwebtoken), bcryptjs, Zod 4, multer, Cloudinary |
| Database | PostgreSQL (Supabase) |
| Image storage | Cloudinary |

## Use Case → ฟีเจอร์
| UC | ชื่อ | ที่อยู่ |
|---|---|---|
| UC-01 | สมัครสมาชิก | หน้า `/register`, `POST /api/auth/register` |
| UC-02 | เข้าสู่ระบบ | หน้า `/login`, `POST /api/auth/login` (JWT) |
| UC-03 | จัดการโปรไฟล์ | หน้า `/profile`, `PUT /api/users/me`, `/me/password` |
| UC-04 | บันทึกข้อมูล (เพิ่มหมวด/ไอเทม) | Home + Category page, `POST /api/categories`, `/items` |
| UC-05 | แก้ไขข้อมูล | ปุ่มแก้ไขในการ์ด, `PUT /api/categories/:id`, `/items/:id` |
| UC-06 | ลบข้อมูล | ปุ่มลบ + ยืนยัน, `DELETE /api/categories/:id`, `/items/:id` |
| UC-07 | ค้นหา | ช่องค้นหา navbar + ในหมวด, `GET /api/items?q=` |
| UC-08 | ดูสถิติ | หน้า `/stats` (กราฟ Recharts), `GET /api/stats` |
| UC-09 | จัดการผู้ใช้ (admin) | หน้า `/admin/users`, `GET/POST/PUT/DELETE /api/admin/users` |
| UC-10 | จัดการระบบ (admin) | หน้า `/admin/settings`, `GET/PUT /api/admin/settings` |
| (เพิ่ม) | รายการโปรด | หน้า `/favorites`, `PATCH /api/items/:id/favorite` |

## ความต้องการระบบ (Prerequisites)
- Node.js 18+ และ npm
- ฐานข้อมูล PostgreSQL — แนะนำ [Supabase](https://supabase.com) (ฟรี) หรือ Postgres ในเครื่อง
- บัญชี Cloudinary (ฟรี) สำหรับเก็บรูปภาพ — ต้องมี cloud name, API key และ API secret

## การติดตั้งและรัน

### 1) Backend (`server/`)
```bash
cd server
npm install
# แก้ server/.env -> ใส่ DATABASE_URL + DIRECT_URL (Supabase) และคีย์ Cloudinary
npx prisma migrate dev   # สร้างตารางในฐานข้อมูล
npm run seed             # ใส่บัญชีทดสอบ + ข้อมูลตัวอย่าง
npm run dev              # API ที่ http://localhost:4000
```

ตัวอย่าง `server/.env`:
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

> Deploy ขึ้น production (Vercel + Render + Supabase) ดูขั้นตอนใน [DEPLOY.md](DEPLOY.md)

### 2) Frontend (`client/`)
```bash
cd client
npm install
npm run dev              # เปิด http://localhost:5173
```
Vite จะ proxy `/api` ไปยัง backend (`:4000`) ให้อัตโนมัติ (ไม่ต้องตั้ง CORS ตอน dev); รูปภาพเสิร์ฟตรงจาก Cloudinary

## บัญชีทดสอบ (จาก seed)
| บทบาท | อีเมล | รหัสผ่าน |
|---|---|---|
| Admin | `admin@demo.com` | `admin1234` |
| User | `user@demo.com` | `user1234` |

## โครงสร้างโปรเจกต์
```
server/
  prisma/schema.prisma      # โมเดล User, Category, Item, SystemSetting
  prisma/seed.js            # บัญชีทดสอบ + ข้อมูลตัวอย่าง + ค่าตั้งต้นระบบ
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

## คำสั่งที่มีให้
**server:** `npm run dev` | `npm start` | `npm run migrate` | `npm run seed` | `npm run studio` (Prisma Studio) | `npm test`
**client:** `npm run dev` | `npm run build` | `npm run preview` | `npm test`

## หมายเหตุทางเทคนิค
- ใช้ **Prisma 6** (ไม่ใช่ 7) เพราะ Prisma 7 บังคับใช้ `prisma.config.ts` + driver adapter ซึ่งไม่เหมาะกับโปรเจกต์ JavaScript ล้วน
- ใช้ **Express 5** (req.query เป็น read-only — validate เก็บผลลง `req.validatedQuery`) และ **Zod 4**
- ทุก query ผูกกับเจ้าของข้อมูล (owner-scoped) ผู้ใช้เห็นเฉพาะข้อมูลตัวเอง ยกเว้น admin
- เก็บ JWT ใน `localStorage` แนบผ่าน axios interceptor; admin route ป้องกันด้วย `AdminRoute`
- รูปภาพ (ไอเทม + avatar) เก็บบน **Cloudinary** — multer รับไฟล์แบบ memory แล้ว stream ขึ้น Cloudinary, เก็บ `public_id` ใน DB (`imagePublicId`/`avatarPublicId`) เพื่อใช้ลบรูปตอนเปลี่ยน/ลบ, ส่งมอบด้วย `f_auto/q_auto` ให้ optimize อัตโนมัติ
