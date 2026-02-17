# SIPERUK Frontend (Vite + React + TS)

Frontend untuk sistem peminjaman ruangan SIPERUK. Menggunakan Vite + React + TypeScript, React Router v7, TanStack Query, TailwindCSS, dan axios. Mendukung autentikasi JWT dengan interceptor otomatis dan penanganan konflik booking.

## Fitur utama
- Login dan proteksi rute berbasis role (`admin`, `staff`, `user`).
- CRUD booking ruang.
- Highlight duplikasi booking (slot waktu/ruang sama) di tabel.
- Manajemen status booking (approve/reject/finish) untuk admin/staff.
- Data ruangan dan status booking dengan caching TanStack Query.

## Prasyarat
- Node.js 18+ (disarankan LTS).
- npm (atau pnpm/yarn, sesuaikan perintah).

## Menjalankan secara lokal
1) Install dependencies
```bash
npm install
```

2) Buat file `.env.local` (atau `.env`) minimal berisi
```bash
VITE_API_BASE_URL=http://localhost:5145
```

3) Jalankan dev server
```bash
npm run dev
```

4) Build produksi
```bash
npm run build
```

5) Preview build
```bash
npm run preview
```

6) Lint & format
```bash
npm run lint
npm run format
```

## Struktur direktori singkat
- `src/routes` – definisi router (Root layout, login, protected dashboard).
- `src/app/layouts` – layout utama dan dashboard.
- `src/features/auth` – konteks auth, protected route.
- `src/hooks` – hooks data (bookings, rooms, statuses, users).
- `src/pages` – halaman utama (Login, Dashboard, Rooms, Bookings, Histories, Users, NotFound).
- `src/api` – klien axios + endpoint helper + tipe DTO.
- `src/components/ui` – komponen UI (Button, Card, FormInput, ResponsiveTable, dsb.).
- `src/lib` – utilitas umum.

## Alur penting
- Auth: token disimpan di `localStorage` (`siperuk_auth`), interceptor request menyisipkan `Authorization`, interceptor response 401 membersihkan sesi dan redirect ke `/login` (kecuali saat login request).
- Booking:
  - Request shape: `{ roomId: number; userId?: number; startTime: string; endTime: string; purpose: string; bookingStatusId?: number }` (ISO time string).
  - Validasi klien: `endTime` harus lebih besar dari `startTime`.
  - Respons 409 dari `/api/Booking`/`/api/Booking/{id}`: ditampilkan sebagai error pada input waktu, dialog tidak ditutup; jika data tersedia, UI menyarankan slot terdekat.
  - Duplikasi slot (ruang+tanggal+jam sama) akan menandai baris tabel kedua dan seterusnya dengan highlight merah.

## Catatan styling
- TailwindCSS dengan theme di `src/styles/tailwind.css` dan global di `src/styles/globals.css`.
- Komponen tabel responsif mendukung `rowClassName` untuk penandaan baris khusus (dipakai untuk highlight duplikasi).

## Lisensi
Internal use. Sesuaikan sebelum publikasi.
