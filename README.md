# Pesona Kahuripan - Landing Page

Repositori resmi untuk berkas template, style (CSS), dan skrip interaktif (JS) website landing page pemasaran **Pesona Kahuripan** ([pesonakahuripan.biz.id](https://www.pesonakahuripan.biz.id)).

---

## 📁 Struktur Berkas

| Berkas | Keterangan |
| :--- | :--- |
| `example.xml` | Template tema XML Blogger (Blogspot) modular & responsif dengan Engine Blog Modern & Schema.org SEO |
| `main_style.css` | Stylesheet CSS utama (Design System, landing page, blog grid, single article reader, kartu promo, ulasan, & kontak) |
| `main_script.js` | Skrip JavaScript interaktif (TOC generator artikel, reading time, share link, marketing sync, kalkulator KPR, galeri, FAQ, popup, WhatsApp, & Cloud Sync) |
| `statistik.html` | Halaman monitoring analytics mandiri (`domain.com/statistik`) untuk pelacakan CTA & Leads calon debitur |
| `google-apps-script.js` | Backend Google Apps Script untuk sinkronisasi multi-device & pencatatan otomatis ke Google Sheets |
| `blog_preview.html` | Halaman pratinjau lokal mandiri untuk menguji tampilan Blog Index dan Single Reader |

---

## 🚀 Penggunaan CDN (Content Delivery Network)

Stylesheet dan script dari repositori ini dimuat secara instan melalui jsDelivr CDN dengan kompresi otomatis dan performa tinggi:

### 1. Stylesheet (CSS)
```html
<link href="https://cdn.jsdelivr.net/gh/pesonaku/landingpage@main/main_style.css" rel="stylesheet"/>
```

### 2. JavaScript (JS)
```html
<script defer="defer" src="https://cdn.jsdelivr.net/gh/pesonaku/landingpage@main/main_script.js"></script>
```

---

## 🛠️ Cara Pasang di Blogger

1. Buka dasbor **Blogger** > menu **Tema (Theme)**.
2. Klik tombol opsi (ikon panah bawah di sebelah *Sesuaikan*) > pilih **Pulihkan (Restore)** > unggah berkas `example.xml`.
3. Seluruh gaya visual (CSS) dan skrip interaktif (JS) otomatis dimuat dari CDN GitHub repositori ini. Setiap perubahan pada CSS atau JS di repositori ini akan langsung diterapkan tanpa perlu mengunggah ulang tema XML ke Blogger.

---

## ☁️ Sinkronisasi Multi-Device & Database Cloud (v3.7.2)

Sistem statistik dilengkapi engine **Multi-Device Cloud Sync terintegrasi Google Sheets**. Seluruh interaksi CTA (Booking Unit Hero, Konsultasi WhatsApp, Tipe Rumah, Lokasi Google Maps, Simulasi KPR, dan Formulir Chat leads) yang dibuka dari perangkat atau browser lain (HP pengunjung, tablet, laptop, dsb.) langsung tersimpan ke Google Sheets dan tersinkronisasi secara real-time ke dashboard `domain.com/statistik` di semua perangkat.

### Panduan Integrasi Google Sheets & Sinkronisasi Semua Perangkat (2 Menit):
1. Buka [sheets.new](https://sheets.new) di browser Anda untuk membuat Google Spreadsheet baru.
2. Klik menu **Ekstensi (Extensions) > Apps Script**.
3. Salin seluruh isi berkas [`google-apps-script.js`](./google-apps-script.js) dan tempel di editor Apps Script.
4. Klik tombol **Terapkan (Deploy) > Penerapan baru (New deployment)**:
   - Jenis: **Aplikasi Web (Web App)**
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja (Anyone)** *(Wajib agar pengunjung website dapat mengirim interaksi & data formulir)*
5. Salin URL Aplikasi Web yang berakhiran `/exec`.
6. **Langkah Kunci Agar Browser Lain & HP Konsumen Tercatat Otomatis**:
   - Tempelkan URL tersebut ke berkas [`example.xml`](./example.xml) atau Template Blogger Anda (Theme > Edit HTML) pada baris:
     ```html
     <script>
       window.PESONA_CLOUD_ENDPOINT = 'https://script.google.com/macros/s/.../exec';
     </script>
     ```
   - Dan simpan juga di dashboard `domain.com/statistik` pada tab **Cloud Sync Google Sheets**.
7. Selesai! Semua klik dan formulir debitur dari semua browser dan perangkat pengunjung akan langsung tercatat ke Google Sheets Anda dan tampil di dashboard statistik secara real-time.

---

## 👤 Pengelola & Pemasaran Resmi
- **Website**: [pesonakahuripan.biz.id](https://www.pesonakahuripan.biz.id)
- **Marketing**: Mas Ro'uf (+62 878-7098-8073)
