# Panduan Menghubungkan Aiven MySQL & Deploy ke Vercel

Sistem website **MapilHub (Daily Vehicle & Lend-Borrow Assistant)** dirancang khusus menggunakan **Next.js App Router**, **Prisma ORM**, dan **Aiven MySQL**, sehingga 100% siap dideploy langsung ke **Vercel**.

---

## 1. Menyiapkan Database di Aiven

1. Buka dan login ke [console.aiven.io](https://console.aiven.io).
2. Klik tombol **Create Service**.
3. Pilih **MySQL** (bisa menggunakan free plan atau startup plan).
4. Pilih Cloud Provider (misal: AWS/Google Cloud) dan Region terdekat (misal: Singapore `ap-southeast-1`).
5. Tunggu 1-2 menit hingga status service menjadi **Running**.
6. Di tab **Overview** -> cari bagian **Connection Information**.
7. Salin **Service URI**. Formatnya seperti:
   ```text
   mysql://avnadmin:YOUR_PASSWORD@mysql-xxxx-project.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED
   ```

---

## 2. Menghubungkan Secara Lokal & Membuat Tabel

1. Buka file `.env` di folder proyek ini (atau salin dari `.env.example`).
2. Tempelkan Service URI Aiven ke `DATABASE_URL`:
   ```env
   DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@mysql-xxxx-project.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED"
   ```
3. Buka terminal proyek ini, lalu jalankan perintah berikut untuk membuat tabel secara otomatis di Aiven:
   ```bash
   npx prisma db push
   ```
   *Prisma akan langsung membaca database Aiven Anda dan membuat tabel `FuelLog`, `MaintenanceLog`, `TripExpense`, dan `LendBorrow` tanpa perlu menulis SQL manual!*

---

## 3. Deploy ke Vercel

1. **Upload ke GitHub:**
   Inisialisasi git dan push proyek ini ke repositori GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: Mapil Daily Hub ready for deployment"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy di Dashboard Vercel:**
   - Kunjungi [vercel.com](https://vercel.com) dan login.
   - Klik **Add New...** -> **Project**.
   - Pilih repositori GitHub Anda tadi, lalu klik **Import**.
   - Di bagian **Environment Variables**, tambahkan:
     - **Name:** `DATABASE_URL`
     - **Value:** `mysql://avnadmin:YOUR_PASSWORD@mysql-xxxx-project.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED`
   - Klik tombol **Deploy**!

3. **Selesai!**
   Vercel akan otomatis mengeksekusi `prisma generate` dan `next build`. Dalam hitungan menit, website Anda sudah aktif dengan URL gratis `https://nama-proyek.vercel.app` yang dapat dibuka dari HP maupun laptop kapan saja.

---

## 4. Fitur CRUD yang Tersedia di Website

### Modul Kendaraan (Vehicle Tracker)
- **BBM (Fuel):**
  - Create: Tambah catatan bensin (tanggal, odo, liter, total Rp, jenis BBM).
  - Read: Daftar log BBM & kalkulasi otomatis **km/liter** dan jarak trip.
  - Update: Edit riwayat bensin.
  - Delete: Hapus riwayat bensin.
- **Servis & Ganti Oli:**
  - Create: Tambah jenis servis, bengkel, biaya, dan target kilometer servis berikutnya.
  - Read: Pengingat cerdas servis terdekat jika odometer mendekati target.
  - Delete: Hapus riwayat servis.
- **Biaya Jalan:**
  - CRUD biaya parkir, tol, dan cuci motor/mobil.

### Modul Pinjam-Meminjam (Lend & Borrow)
- **Barang & Uang:**
  - Create: Catat pinjaman (pilihan: Dipinjamkan vs Meminjam, Barang vs Uang tunai), tanggal tenggat, catatan.
  - Read: Kartu ringkasan total piutang, total utang, barang di luar, dan filter tab aktif vs selesai.
  - Update: 1-Klik tombol "Tandai Dikembalikan / Lunas", edit data.
  - Delete: Hapus catatan pinjaman.

