/**
 * SNBM Creator — Host registration to Sheets + permanent private Drive files.
 * Deploy as Web app: Execute as Me / Who has access: Anyone.
 * Script Properties: SNBM_SHEETS_API_TOKEN (same 32+ character server secret).
 * Script is intentionally limited to the "Pendaftaran Host" tab.
 * Host records are upserted by ID; Status Seleksi and Catatan HR are preserved.
 * Optional: SNBM_HOST_FOLDER_ID = an existing PRIVATE Drive folder ID.
 * Google Drive files stay restricted by Google account permissions (not public).
 */
const SNBM_SHEET_ID = '1jjOwqdOerJApVYo3ftygUvAh0U20Luqfb4VhoqssISw';
const SNBM_HOST_TAB = 'Pendaftaran Host';
const SNBM_FILE_FOLDER_KEY = 'SNBM_HOST_FOLDER_ID';
const SNBM_FILE_FOLDER_NAME = 'SNBM Creator - Berkas Pendaftar (Privat)';
const SNBM_SOURCE_HOST = 'ypqlcnxpuwpzhnfnuxsz.supabase.co';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(e && e.postData && e.postData.contents || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('SNBM_SHEETS_API_TOKEN');
    if (!expected || expected.length < 32 || body.token !== expected) {
      return reply_({ok:false,error:'Unauthorized'});
    }
    if (body.type !== 'host') {
      // Leave the separate brand intake unchanged: this script handles HOST ONLY.
      return reply_({ok:false,error:'This endpoint is for host applications only'});
    }
    if (!body.record || !isUuid_(body.record.id)) return reply_({ok:false,error:'Invalid host ID'});
    if (!lock.tryLock(25000)) return reply_({ok:false,error:'Busy, retry'});
    try {
      const result = saveHost_(body.record);
      return reply_({ok:true,id:body.record.id,cv_url:result.cv,video_url:result.video});
    } finally { lock.releaseLock(); }
  } catch (err) {
    // Never log signed URLs, applicant data, or token.
    console.error('Host sync failed: ' + String(err && err.message || err).slice(0,150));
    return reply_({ok:false,error:'Host sync failed; retry later'});
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isUuid_(v) {
  return typeof v === 'string' &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v);
}

function folder_() {
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty(SNBM_FILE_FOLDER_KEY);
  if (folderId) return DriveApp.getFolderById(folderId);
  const f = DriveApp.createFolder(SNBM_FILE_FOLDER_NAME);
  props.setProperty(SNBM_FILE_FOLDER_KEY, f.getId());
  return f;
}

function safeSourceUrl_(url) {
  if (typeof url !== 'string') throw Error('Missing source');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' ||
      parsed.hostname !== SNBM_SOURCE_HOST ||
      !parsed.pathname.startsWith('/storage/v1/object/sign/snbm-host-private/')) {
    throw Error('Untrusted file origin');
  }
  if (!parsed.searchParams.has('token')) throw Error('Missing temporary source token');
  return url;
}

function copyIntoDrive_(entry, kind, id, existing) {
  if (!entry) return existing || '';
  if (!entry.url || typeof entry.name !== 'string') throw Error('Invalid document');
  const name = (kind === 'cv' ? 'CV_' : 'Video_') + id +
    (kind === 'cv' ? (/\.docx?$/i.test(entry.name) ? entry.name.match(/\.docx?$/i)[0] : '.pdf')
                   : (/\.(mov|webm)$/i.test(entry.name) ? entry.name.match(/\.(mov|webm)$/i)[0] : '.mp4'));
  const driveFolder = folder_();
  const prior = driveFolder.getFilesByName(name);
  if (prior.hasNext()) return 'https://drive.google.com/file/d/' + prior.next().getId() + '/view';
  const src = safeSourceUrl_(entry.url);
  const response = UrlFetchApp.fetch(src, {muteHttpExceptions:true,followRedirects:true});
  if (response.getResponseCode() !== 200) throw Error('Source download failed');
  const blob = response.getBlob().setName(name);
  const file = driveFolder.createFile(blob);
  // File stays private: no ANYONE_WITH_LINK permissions are added.
  return 'https://drive.google.com/file/d/' + file.getId() + '/view';
}

function saveHost_(r) {
  const sh = SpreadsheetApp.openById(SNBM_SHEET_ID).getSheetByName(SNBM_HOST_TAB);
  if (!sh) throw Error('Pendaftaran Host tab not found');
  const last = sh.getLastRow();
  let rowNum = 0;
  if (last > 1) {
    const existing = sh.getRange(2, 2, last - 1, 1)
      .createTextFinder(String(r.id)).matchEntireCell(true).findNext();
    if (existing) rowNum = existing.getRow();
  }
  const original = rowNum ? sh.getRange(rowNum, 1, 1, 23).getValues()[0] : Array(23).fill('');
  const extra = r._drive_files || {};
  // Column Q/R always contain durable Drive links, never temporary Supabase JWTs.
  const cv = copyIntoDrive_(extra.cv, 'cv', r.id,
    typeof original[16] === 'string' && original[16].startsWith('https://drive.google.com/file/d/') ? original[16] : '');
  const video = copyIntoDrive_(extra.video, 'video', r.id,
    typeof original[17] === 'string' && original[17].startsWith('https://drive.google.com/file/d/') ? original[17] : '');
  const date = r.created_at ? new Date(r.created_at) : new Date();
  const consent = r.consent_at ? new Date(r.consent_at) : '';
  const currency = Number(r.best_daily_gmv) || 0;
  const values = [
    date, String(r.id), clean_(r.name), clean_(r.email), phone_(r.phone),
    clean_(r.employment_type), clean_(r.city), clean_(r.size_type),
    clean_(r.style), r.weight == null ? '' : Number(r.weight),
    clean_(r.category), clean_(r.experience),
    r.daily_live_hours == null ? '' : Number(r.daily_live_hours),
    currency, clean_(r.social_accounts), clean_(r.portfolio_url),
    cv, video, clean_(r.trial_video_url),
    'Ya', consent,
    original[21] || 'Baru', original[22] || ''
  ];
  const target = rowNum || last + 1;
  sh.getRange(target, 1, 1, 23).setValues([values]);
  sh.getRange(target, 1).setNumberFormat('dd mmm yyyy, hh:mm:ss');
  sh.getRange(target, 21).setNumberFormat('dd mmm yyyy, hh:mm:ss');
  sh.getRange(target, 14).setNumberFormat('"Rp" #,##0');
  return {cv,video};
}
function clean_(value) {
  if (value == null) return '';
  const s = String(value);
  // Escape formulas in user input.
  return /^[=+@\-\t\r]/.test(s) ? "'" + s : s;
}
function phone_(value) { return value ? "'" + String(value).replace(/^'/,'') : ''; }

/** Run once from editor to authorize Spreadsheet, Drive and UrlFetch scopes. */
function verifyHostIntegration() {
  const sh = SpreadsheetApp.openById(SNBM_SHEET_ID).getSheetByName(SNBM_HOST_TAB);
  if (!sh) throw Error('Missing Host tab');
  const dir = folder_();
  console.log('Host tab and private Drive folder ready: ' + dir.getName());
}
