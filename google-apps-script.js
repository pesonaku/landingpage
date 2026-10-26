/**
 * ======================================================================
 * PESONA KAHURIPAN - CLOUD SYNC & LEADS BACKEND ENGINE (Google Apps Script)
 * Version: 3.7.0
 * Website: https://www.pesonakahuripan.biz.id
 * Repository: https://github.com/pesonaku/landingpage
 * ======================================================================
 * 
 * PANDUAN CARA PASANG DALAM 2 MENIT:
 * 1. Buka https://sheets.new di browser Anda (masuk dengan akun Google Anda).
 * 2. Beri nama Spreadsheet, misalnya: "Database Leads & Statistik Pesona Kahuripan".
 * 3. Di menu atas, klik: Ekstensi (Extensions) > Apps Script.
 * 4. Hapus semua kode default di Apps Script, lalu salin (copy) SELURUH isi file ini dan tempel (paste) ke sana.
 * 5. Klik ikon Simpan (Save / Ctrl+S).
 * 6. Klik tombol biru "Terapkan" (Deploy) di kanan atas > pilih "Penerapan baru" (New deployment).
 * 7. Pada ikon Gerigi (Select type), pilih "Aplikasi Web" (Web app).
 * 8. Konfigurasi:
 *    - Deskripsi: "Pesona Kahuripan Cloud Sync v3.7.0"
 *    - Jalankan sebagai (Execute as): "Saya" (Me / akun Google Anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> *PENTING agar pengunjung web bisa kirim leads*
 * 9. Klik "Terapkan" (Deploy) > Berikan izin (Authorize access) jika diminta.
 * 10. Salin URL Aplikasi Web yang berakhiran "/exec", lalu:
 *     - Buka menu statistik di website Anda: domain.com/statistik (atau Ctrl + Shift + S)
 *     - Masukkan URL tersebut pada tab "Cloud Sync & GA4" lalu klik "Simpan & Hubungkan"!
 * 
 * Selesai! Semua klik CTA dan data formulir calon pembeli dari perangkat mana pun
 * akan otomatis tercatat ke Spreadsheet ini dan terbaca secara real-time di semua perangkat.
 * ======================================================================
 */

const SHEET_NAME_LEADS = "Data Debitur & Leads";
const SHEET_NAME_LOGS = "Riwayat Log CTA";
const PROP_KEY_STATS = "PESONAKU_CTA_STATS_JSON";

/**
 * Handle HTTP GET Requests (Mengambil data statistik & leads untuk ditampilkan di website)
 */
function doGet(e) {
  try {
    e = e || { parameter: {} };
    const action = (e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : 'get';

    // 1. Endpoint Ping untuk Tes Koneksi dari Dashboard
    if (action === 'ping') {
      return createJsonResponse({
        status: 'success',
        message: 'Google Apps Script Cloud Sync terhubung aktif!',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Track Event via GET (Fallback jika POST terblokir oleh browser tertentu)
    if (action === 'track') {
      const ctaId = e.parameter.ctaId || 'unknown_cta';
      const ctaName = e.parameter.ctaName || 'Tombol CTA';
      const ctaSection = e.parameter.ctaSection || 'General';
      const ctaTarget = e.parameter.ctaTarget || 'Action';
      const leadName = e.parameter.userName || e.parameter.name || '';
      const leadPhone = e.parameter.phone || '';
      const leadMessage = e.parameter.message || '';

      const payload = {
        action: 'track_event',
        ctaId: ctaId,
        ctaName: ctaName,
        ctaSection: ctaSection,
        ctaTarget: ctaTarget,
        lead: leadPhone ? { name: leadName, phone: leadPhone, message: leadMessage } : null
      };

      return processTrackEvent(payload);
    }

    // 3. Reset Data (Dipanggil dari tombol Reset di Dashboard jika diperlukan)
    if (action === 'reset') {
      const resetData = getInitialStatsObject();
      PropertiesService.getScriptProperties().setProperty(PROP_KEY_STATS, JSON.stringify(resetData));
      return createJsonResponse({ status: 'success', message: 'Data statistik di cloud berhasil direset!' });
    }

    // 4. Default: Mengembalikan seluruh data statistik & leads teragregasi
    const statsData = getOrRebuildStatsData();
    return createJsonResponse(statsData);

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Handle HTTP POST Requests (Menerima event klik CTA dan form chat debitur dari website)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'track_event';

    if (action === 'reset') {
      const resetData = getInitialStatsObject();
      PropertiesService.getScriptProperties().setProperty(PROP_KEY_STATS, JSON.stringify(resetData));
      return createJsonResponse({ status: 'success', message: 'Data statistik di cloud berhasil direset!' });
    }

    return processTrackEvent(payload);

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * Memproses penyimpanan event klik & data debitur ke Spreadsheet dan ScriptProperties
 */
function processTrackEvent(payload) {
  const ctaId = payload.ctaId || 'cta_unknown';
  const ctaName = payload.ctaName || 'Tombol CTA';
  const ctaSection = payload.ctaSection || 'General';
  const ctaTarget = payload.ctaTarget || 'WhatsApp API';
  const lead = payload.lead || null;

  const now = new Date();
  // Format Waktu WIB (UTC+7)
  const timeFormatted = Utilities.formatDate(now, "GMT+7", "d MMM yyyy, HH:mm:ss") + " WIB";
  const dateKey = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. JIKA ADA DATA FORMULIR DEBITUR (NAMA & NO WHATSAPP), SIMPAN KE SHEET LEADS
  if (lead && lead.phone) {
    const leadsSheet = getOrCreateSheet(ss, SHEET_NAME_LEADS, [
      "No",
      "Waktu Masuk",
      "Nama Calon Debitur",
      "Nomor WhatsApp",
      "Pesan / Minat Unit",
      "Tombol CTA",
      "Kategori / Bagian Web"
    ]);

    const nextRow = leadsSheet.getLastRow() + 1;
    const noUrut = Math.max(1, nextRow - 1);

    leadsSheet.appendRow([
      noUrut,
      timeFormatted,
      lead.name || payload.userName || "Calon Debitur",
      "'" + lead.phone, // Diberi tanda petik agar tidak diubah format oleh Excel/Sheets
      lead.message || "-",
      ctaName,
      ctaSection
    ]);
  }

  // 2. SIMPAN LOG AKTIVITAS KE SHEET LOGS
  const logsSheet = getOrCreateSheet(ss, SHEET_NAME_LOGS, [
    "Waktu",
    "Aksi / Tombol CTA",
    "Kategori",
    "Tujuan",
    "No. WhatsApp Debitur (Jika Ada)"
  ]);

  logsSheet.appendRow([
    timeFormatted,
    ctaName,
    ctaSection,
    ctaTarget,
    (lead && lead.phone) ? "'" + lead.phone : "-"
  ]);

  // 3. UPDATE AGREGASI STATISTIK CEPAT DI SCRIPT PROPERTIES
  const stats = getOrRebuildStatsData();
  stats.totalClicks = (stats.totalClicks || 0) + 1;
  stats.lastUpdated = now.toISOString();

  // Hitungan harian
  stats.daily = stats.daily || {};
  stats.daily[dateKey] = (stats.daily[dateKey] || 0) + 1;

  // Hitungan kategori
  stats.bySection = stats.bySection || {};
  stats.bySection[ctaSection] = (stats.bySection[ctaSection] || 0) + 1;

  // Hitungan per tombol CTA
  stats.byCta = stats.byCta || {};
  if (!stats.byCta[ctaId]) {
    stats.byCta[ctaId] = {
      id: ctaId,
      name: ctaName,
      section: ctaSection,
      target: ctaTarget,
      count: 0,
      lastClicked: ''
    };
  }
  stats.byCta[ctaId].count++;
  stats.byCta[ctaId].lastClicked = timeFormatted;
  if (lead && lead.phone) {
    stats.byCta[ctaId].name = ctaName;
    stats.byCta[ctaId].lastPhone = lead.phone;
    stats.byCta[ctaId].lastMessage = lead.message || '';
    stats.byCta[ctaId].lastUserName = lead.name || '';
  }

  // Tambahkan ke log aktivitas terkini (maksimal 50 log terakhir)
  stats.logs = stats.logs || [];
  stats.logs.unshift({
    id: ctaId,
    name: ctaName,
    section: ctaSection,
    target: ctaTarget,
    timestamp: now.toISOString(),
    timeFormatted: timeFormatted,
    phone: (lead && lead.phone) ? lead.phone : null,
    message: (lead && lead.message) ? lead.message : null,
    userName: (lead && lead.name) ? lead.name : null
  });
  if (stats.logs.length > 50) stats.logs = stats.logs.slice(0, 50);

  // Tambahkan ke list leads terkini (maksimal 100 leads terakhir)
  if (lead && lead.phone) {
    stats.leads = stats.leads || [];
    stats.leads.unshift({
      name: lead.name || ctaName.replace(/^Formulir Chat:\s*/i, '').replace(/\s*\([^)]*\)$/, ''),
      phone: lead.phone,
      message: lead.message || '',
      timestamp: now.toISOString(),
      timeFormatted: timeFormatted
    });
    if (stats.leads.length > 100) stats.leads = stats.leads.slice(0, 100);
  }

  // Simpan JSON agregasi ke PropertiesService
  PropertiesService.getScriptProperties().setProperty(PROP_KEY_STATS, JSON.stringify(stats));

  return createJsonResponse({
    status: 'success',
    totalClicks: stats.totalClicks,
    leadsCount: (stats.leads || []).length,
    timestamp: timeFormatted
  });
}

/**
 * Mengambil data agregasi statistik. Jika belum ada di Properties, inisialisasi default.
 */
function getOrRebuildStatsData() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(PROP_KEY_STATS);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        parsed.bySection = parsed.bySection || {};
        parsed.byCta = parsed.byCta || {};
        parsed.daily = parsed.daily || {};
        parsed.logs = Array.isArray(parsed.logs) ? parsed.logs : [];
        parsed.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
        parsed.totalClicks = typeof parsed.totalClicks === 'number' ? parsed.totalClicks : 0;
        return parsed;
      }
    } catch (e) {}
  }

  const initial = getInitialStatsObject();
  props.setProperty(PROP_KEY_STATS, JSON.stringify(initial));
  return initial;
}

function getInitialStatsObject() {
  return {
    version: '3.7.0',
    firstTracked: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    totalClicks: 0,
    daily: {},
    bySection: {},
    byCta: {},
    logs: [],
    leads: []
  };
}

/**
 * Helper untuk membuat atau mengambil sheet dengan header berformat rapi
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#38bdf8");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Helper untuk mengembalikan Response JSON dengan Header CORS terbuka
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
