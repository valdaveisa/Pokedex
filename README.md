# Pokédex REST API

REST API untuk mengelola data Pokémon dengan Express, TypeScript, Prisma, dan PostgreSQL.

## Fitur

- CRUD Pokémon dengan relasi many-to-many ke Type.
- Search nama, filter type, pagination, dan sorting.
- Validasi request dengan Zod serta format error JSON konsisten.
- JWT authentication dan RBAC; endpoint create/update/delete hanya dapat digunakan role `ADMIN`.
- Redis caching untuk list/detail Pokémon dengan invalidasi otomatis setelah create/update/delete.
- Prisma schema, migration, seed data, Swagger UI, Docker Compose, dan test dasar.

## Menjalankan secara lokal

1. Pastikan Node.js 20+ dan PostgreSQL tersedia.
2. Salin `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` dan `JWT_SECRET`.
3. Install dependency dan generate client:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. Jalankan server:

   ```bash
   npm run dev
   ```

Swagger tersedia di `http://localhost:3000/docs`.

Redis dijalankan otomatis oleh Docker Compose pada port `6379`. Cache list/detail menggunakan TTL 60 detik dan dihapus setelah operasi mutasi.

## Docker

```bash
docker compose up --build
```

## Endpoint utama

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Mendapatkan JWT |
| GET | `/api/v1/pokemon` | List (`search`, `type`, `page`, `limit`, `sortBy`, `order`) |
| GET | `/api/v1/pokemon/:id` | Detail |
| POST | `/api/v1/pokemon` | Create (JWT + ADMIN) |
| PUT | `/api/v1/pokemon/:id` | Update (JWT + ADMIN) |
| DELETE | `/api/v1/pokemon/:id` | Delete (JWT + ADMIN) |
| GET | `/api/v1/types` | List type |

Semua response sukses menggunakan `{ "success": true, "data": ... }`; list menambahkan `meta`. Error menggunakan `{ "success": false, "error": { "message": ... } }`.

Seed membuat akun `admin@pokedex.local` dengan password `password123` dan role `ADMIN`. User yang register mendapat role `USER` dan hanya dapat mengakses endpoint read-only. Ganti password tersebut untuk lingkungan nyata.

## Quality checks

```bash
npm run build
npm test
npm run lint
```

Test mencakup integration test health/RBAC dan unit test validasi schema.

## Bonus yang tersedia

- JWT authentication.
- Role-based access control (`USER` dan `ADMIN`).
- Unit test dan integration test.
- Docker Compose dengan PostgreSQL dan Redis.
- Redis caching dengan cache invalidation setelah perubahan data.
