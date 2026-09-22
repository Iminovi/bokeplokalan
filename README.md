# KatalogKu - Katalog Produk & Afiliasi E-Commerce

Aplikasi web katalog produk modern dan responsif dengan pemisahan area belanja pengunjung dan menu pengaturan toko/afiliasi yang dilindungi PIN Admin.

## Fitur Utama
- **Katalog & Navigasi Pengunjung**: Etalase produk terkurasi, pencarian cepat, filter kategori, badge promo, wishlist belanja, dan rincian spesifikasi produk.
- **Keamanan & Otorisasi Admin**: Menu pengaturan dilindungi kode PIN numerik (default: `1234`), mode senyap (*Stealth Mode*), dan bilah sesi admin (*AdminBar*).
- **Manajemen Produk**: Tambah produk baru, ganti gambar/foto (upload lokal atau URL), edit deskripsi & poin keunggulan, duplikasi produk, dan hapus produk.
- **Konfigurasi Afiliasi & Auto-Redirect**: Pengaturan tautan affiliate Shopee, timer pengalihan otomatis, dan kupon voucher.
- **Penyimpanan Lokal (localStorage)**: Semua perubahan tersimpan otomatis di browser tanpa memerlukan server database eksternal.

---

## Cara Menjalankan di Komputer Lokal

1. **Clone repository ini**:
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd <NAMA_FOLDER>
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

---

## Cara Deploy ke GitHub Pages (Gratis & Otomatis)

Proyek ini telah dikonfigurasi dengan `base: './'` di `vite.config.ts`, sehingga siap di-deploy ke GitHub Pages dengan 2 cara:

### Cara 1: Otomatis via GitHub Actions (Paling Direkomendasikan ⭐)

Proyek ini sudah dilengkapi file workflow `.github/workflows/deploy.yml`. Anda hanya perlu:

1. Buat repository baru di [GitHub](https://github.com/new).
2. Upload/push seluruh kode ini ke branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit KatalogKu"
   git branch -M main
   git remote add origin https://github.com/<USERNAME_GITHUB>/<NAMA_REPO>.git
   git push -u origin main
   ```
3. Buka repository Anda di GitHub, lalu klik tab **Settings**.
4. Di bilah samping kiri, pilih **Pages** (di bagian *Code and automation*).
5. Pada bagian **Build and deployment** -> **Source**, ubah dari *Deploy from a branch* menjadi:
   👉 **GitHub Actions**
6. Selesai! GitHub Actions akan otomatis mem-build dan mempublikasikan website Anda ke alamat:
   `https://<USERNAME_GITHUB>.github.io/<NAMA_REPO>/`

---

### Cara 2: Manual via `npm run deploy` (gh-pages)

Jika Anda ingin deploy langsung dari terminal komputer:

1. Di file `package.json`, tambahkan properti `"homepage"` (opsional jika menggunakan `base: './'`), contoh:
   ```json
   "homepage": "https://<USERNAME_GITHUB>.github.io/<NAMA_REPO>"
   ```
2. Jalankan perintah:
   ```bash
   npm run deploy
   ```
3. Script akan otomatis mem-build proyek ke folder `dist` dan mengunggahnya ke branch `gh-pages` di GitHub Anda.
4. Buka **Settings** -> **Pages** di repository GitHub Anda, pastikan Source memilih branch `gh-pages`.
