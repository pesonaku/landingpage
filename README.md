# Pesona Kahuripan - Landing Page

Repositori resmi untuk berkas template, style (CSS), dan skrip interaktif (JS) website landing page pemasaran **Pesona Kahuripan** ([pesonakahuripan.biz.id](https://www.pesonakahuripan.biz.id)).

---

## 📁 Struktur Berkas

| Berkas | Keterangan |
| :--- | :--- |
| `example.xml` | Template tema XML Blogger (Blogspot) yang modular, ringan, dan bebas kode usang |
| `main_style.css` | Stylesheet CSS utama (Design System, tata letak responsif, kartu promo, ulasan, & kontak) |
| `main_script.js` | Skrip JavaScript interaktif (Sinkronisasi marketing dinamis, kalkulator KPR, galeri, FAQ, popup, WhatsApp, & Cloud Sync) |
| `statistik.html` | Halaman monitoring analytics mandiri (`domain.com/statistik`) untuk pelacakan CTA & Leads calon debitur |
| `google-apps-script.js` | Backend Google Apps Script untuk sinkronisasi multi-device & pencatatan otomatis ke Google Sheets |

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

## ☁️ Sinkronisasi Multi-Device & Database Cloud (v3.7.1)

Sistem statistik kini telah dilengkapi **Multi-Device Cloud Relay otomatis** (langsung aktif out-of-the-box tanpa konfigurasi tambahan). Seluruh interaksi CTA (Booking Unit Hero, Konsultasi WhatsApp, Tipe Rumah, Lokasi, Simulasi KPR, Formulir Chat leads) yang dibuka dari perangkat atau browser lain (HP pengunjung, laptop, dsb.) akan langsung tersinkronisasi dan dapat dilihat di dashboard `domain.com/statistik` dari perangkat mana pun.

### Opsi Integrasi Google Sheets (Private Spreadsheet)
Jika Anda juga ingin menyimpan arsip seluruh klik & database leads calon pembeli langsung ke Google Drive pribadi Anda:
1. Buka [sheets.new](https://sheets.new) di browser Anda untuk membuat Google Spreadsheet baru.
2. Klik menu **Ekstensi (Extensions) > Apps Script**.
3. Salin seluruh isi berkas [`google-apps-script.js`](./google-apps-script.js) dan tempel di Apps Script.
4. Klik tombol **Terapkan (Deploy) > Penerapan baru (New deployment)**:
   - Jenis: **Aplikasi Web (Web App)**
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja (Anyone)**
5. Salin URL Aplikasi Web yang berakhiran `/exec`.
6. Buka halaman monitoring di website Anda (`domain.com/statistik` atau tekan `Ctrl + Shift + S`) > buka tab **Cloud Sync & Google Sheets** > tempel URL tersebut lalu klik **Simpan & Hubungkan**.
7. Data akan dicatat secara otomatis ke Google Sheets sekaligus disinkronkan secara real-time ke semua perangkat.

---

## 👤 Pengelola & Pemasaran Resmi
- **Website**: [pesonakahuripan.biz.id](https://www.pesonakahuripan.biz.id)
- **Marketing**: Mas Ro'uf (+62 878-7098-8073)
