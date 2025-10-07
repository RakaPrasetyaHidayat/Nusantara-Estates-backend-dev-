# Nusantara Estates - Backend

Dokumentasi singkat API, cara menjalankan lokal, dan panduan deployment.

Ringkasan
---------
Backend ini adalah Express.js API untuk aplikasi Nusantara Estates. Aplikasi menyediakan endpoint publik untuk daftar/ detail properti, serta endpoint admin untuk CRUD properti yang memerlukan JWT.

Table of Contents
- Cara menjalankan lokal
- Environment variables
- Endpoints (method, path, request, response)
- Autentikasi (JWT)
- CORS
- Deployment (Rekomendasi & Vercel / Serverless notes)

1) Cara menjalankan lokal
-------------------------
Persyaratan:
- Node.js 18+ dan npm
- MySQL (opsional: ada juga `server/app-no-db.js` untuk mode tanpa DB)

Langkah cepat (pakai MySQL):

1. Copy `.env.example` ke `.env` dan sesuaikan kredensial MySQL & JWT.
2. Jalankan database setup:

```powershell
npm run setup-db
```

3. Jalankan server (koneksi MySQL):

```powershell
npm run server
```

4. Alternatif tanpa DB (development cepat):

```powershell
npm run server:no-db
```

2) Environment variables penting
--------------------------------
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- PORT (default 5174)
- FRONTEND_URL (origin yang diizinkan untuk CORS, contoh: http://localhost:5173)
- ADDITIONAL_ORIGINS (opsional, comma-separated)
- JWT_SECRET (harus diisi untuk produksi)
- JWT_EXPIRES_IN

3) Endpoints (ringkasan lengkap)
--------------------------------

Public:

- GET /api/properties
  - Query params: tipe, lokasi, page, limit
  - Response: { success, data: [properties], page, limit, total }

- GET /api/properties/:id
  - Response: { success, data: property }

- POST /api/search-rumah
  - Body: { lokasi, tipe }
  - Response: { success, data: [properties] }

Auth:

- POST /api/register
  - Body: { username, email, password, confirmPassword }
  - Response: { success, message, id }

- POST /api/login
  - Body: { username, password }
  - Response: { success, user, token }
  - Notes: ada admin hardcoded `NEadmin / BARA211` untuk testing.

Admin (requires Authorization: Bearer <token>):

- GET /api/admin/properties
  - Query: page, limit
  - Response: { success, data: [properties], page, limit, total }

- POST /api/admin/properties
  - multipart/form-data (image upload) or application/json for no-db testing
  - Required fields: title, price, location
  - Files: image_url (single), images (multiple)
  - Response: { success, id, message }

- GET /api/admin/properties/:id
  - Response: { success, data: property }

- PUT /api/admin/properties/:id
  - multipart/form-data or JSON. Response: { success, message }

- DELETE /api/admin/properties/:id
  - Response: { success, message }

4) Autentikasi
---------------
- Login mengembalikan JWT yang harus dikirim pada header:

  Authorization: Bearer <token>

5) CORS
--------
- Server membaca `FRONTEND_URL` dan `ADDITIONAL_ORIGINS` dari `.env`.
- Server juga mengizinkan origin yang berakhiran `.vercel.app`.
- Jika frontend Anda di-deploy ke Vercel, atur `FRONTEND_URL` ke origin (atau tambahkan ke `ADDITIONAL_ORIGINS`) untuk mengizinkan fetch dari browser.

6) Deployment

Catatan penting tentang Vercel:
Vercel env via CLI (optional):
```powershell
# add environment variable to production
vercel env add DB_HOST production
vercel env add DB_USER production
vercel env add DB_PASSWORD production
vercel env add DB_NAME production
vercel env add JWT_SECRET production
vercel env add FRONTEND_URL production
```

After adding env vars, run `vercel --prod` to deploy.
Catatan penting tentang Vercel:
- Vercel tidak menjalankan proses server yang terus-menerus seperti `node server/app.js`. Untuk menggunakan Vercel Anda perlu mengubah API menjadi serverless functions (file di folder `/api`) atau menggunakan platform yang mendukung long-running Node process (contoh: Render, Railway, Heroku, DigitalOcean App Platform).

Opsi A (direkomendasikan, cepat): Deploy backend ke Render / Railway
- Build & start command: `npm run server` (server akan berjalan sebagai proses Node biasa).
- Steps singkat (Render):
  1. Sign up di https://render.com
  2. Connect GitHub repo
  3. Create a new Web Service, pilih Node, dan isi build/start: `npm ci` dan `npm start` atau `npm run server`
  4. Set env vars (DB, JWT_SECRET, FRONTEND_URL)

Opsi B (Vercel) — konversi ke Serverless (lebih banyak pekerjaan)
- Anda harus memindahkan endpoint ke fungsi serverless di folder `/api` (setiap route jadi file atau nested folders). Contoh: `api/login.js` akan mengekspor handler yang menerima req/res ala Vercel.
- Perhatikan:
  - File upload (multer) tidak bekerja langsung di serverless; Anda perlu menggunakan solusi upload langsung ke S3/Cloudinary dari client.
  - Connection pooling ke MySQL harus dibuat ulang untuk serverless (gunakan mysql2 dan pattern singleton connection reuse).

Catatan tambahan: saya sudah menambahkan serverless endpoints dasar di folder `api/`:
- `api/login.js` (POST) - login dan mengembalikan JWT
- `api/properties.js` (GET) - list properties
- `api/properties/[id].js` (GET) - detail property
- `api/admin/properties` (GET, POST) - admin CRUD (JSON-only) with JWT
- `api/admin/properties/[id]` (GET, PUT, DELETE) - admin CRUD (JSON-only)

Untuk Vercel: pastikan environment variables di Project Settings sudah diisi (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, FRONTEND_URL). Untuk koneksi MySQL di serverless saya menambahkan `server/db-serverless.js` yang membuat pool yang di-reuse via `globalThis`.

Contoh minimal `api/login.js` (konsep):

```js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../../server/db.js'; // adjust path or create small DB helper for serverless

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  // login logic -> query MySQL, compare bcrypt, sign JWT
}
```

Jika Anda ingin saya bantu deploy ke Vercel, opsi yang paling realistis adalah:
1. Convert endpoints to serverless one-by-one (I can scaffold key endpoints: login, properties list, property detail). OR
2. Deploy backend to Render/Railway now and keep frontend on Vercel (recommended). I can prepare `render.yaml` or deploy instructions.

7) Post-deploy checks (what FE needs to know)
- FRONTEND_URL must match the deployed frontend origin for browser fetches with credentials.
- Ensure JWT_SECRET in production is strong.
- For file uploads use cloud storage and return public URLs.

8) Saya bisa bantu lanjutkan (pilih salah satu):
- A: Saya siapkan `render.yaml` atau instruksi lengkap untuk deploy ke Render (satu commit, otomatis deploy).
- B: Saya konversi endpoint kritis ke fungsi Vercel `/api` (login + properties listing + detail) agar bisa langsung deploy di Vercel.
- C: Saya buat Postman collection / curl scripts untuk semua endpoint yang bisa Anda import.

Pilih A, B, atau C — atau sebutkan preferensi lain, dan saya akan kerjakan langkah berikutnya.
<<<<<<< HEAD
..
=======
- app.jsx (index atau induk dari semua page yang ada)
- index.css (style untuk app.jsx)


<!-- FOLDER COMPONENTS PENJELASAN -->
Folder Components
mencangkup semua component untuk dimasukan ke pages
contoh : 
homePage.jsx hanya untuk parentnya saja
komponennya berada di Folder "Components"
misalnya 
-navbar
-hero
-dll
>>>>>>> d16d850 (Initial commit)

--------------------- Server, Script & Database folder ----------------
Berisi Koneksi & konfigurasi Database dan API

--------------------- Role Management ---------------

Roole : Admin, User, Guest

Admin :
    - bisa mengakses semua halaman
    - CRUD semua data rumah yang sudah dan akan di input
    - Password :
User : Read only dan bisa dan bisa menga
Guest :
    - tidak bisa mengakses halaman admin dan user

------------------ Pages -----------------------
Berisi Page apa saja yang akan ditampilkan kepada pengguna    

------------------ Admin -------------------
Username NEadmin
Password BARA211
email admin@nusantara.com
