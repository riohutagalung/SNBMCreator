/**
 * SNBM Creator — Host-only private attachment archiver for the EXISTING
 * Apps Script Code.gs provided by the project owner.
 *
 * Put this content in a NEW script file HostDriveSync.gs in the SAME
 * Apps Script project. Do not replace Code.gs or create another doPost().
 *
 * In the existing doPost(e), replace only:
 *   const row = isHost ? mapHost_(record) : mapBrand_(record);
 * with:
 *   const row = isHost ? mapHost_(archiveHostFiles_(record)) : mapBrand_(record);
 *
 * Brand routing, authentication, upsert, formatting and manual status/notes
 * remain untouched. No public sharing of applicants' files.
 */

const SNBM_ARCHIVE = Object.freeze({
  folderProperty: 'SNBM_HOST_FOLDER_ID',
  folderName: 'SNBM Creator - Berkas Host Privat',
  sourcePrefix: 'https://ypqlcnxpuwpzhnfnuxsz.supabase.co/storage/v1/object/sign/snbm-host-private/'
});

function archiveHostFiles_(record) {
  if (!record || !record._drive_files || typeof record._drive_files !== 'object') {
    throw new Error('HOST_ARCHIVE_FILES_MISSING');
  }
  const files = record._drive_files;
  const cv = archiveHostFile_(record, files.cv, 'cv');
  const video = record.trial_video_path
    ? archiveHostFile_(record, files.video, 'video')
    : '';
  // Return a shallow copy so existing mapHost_ and upsert_ remain unchanged.
  // The two output columns are now restricted Google Drive links, never JWTs.
  return Object.assign({}, record, {cv_path: cv, trial_video_path: video});
}

function archiveHostFolder_() {
  const props = PropertiesService.getScriptProperties();
  const existing = props.getProperty(SNBM_ARCHIVE.folderProperty);
  if (existing) return DriveApp.getFolderById(existing);
  const folder = DriveApp.createFolder(SNBM_ARCHIVE.folderName);
  props.setProperty(SNBM_ARCHIVE.folderProperty, folder.getId());
  return folder;
}

function archiveHostFile_(record, descriptor, kind) {
  if (!descriptor || typeof descriptor.url !== 'string' ||
      typeof descriptor.name !== 'string') {
    throw new Error('HOST_ARCHIVE_INVALID_' + kind.toUpperCase());
  }
  const source = descriptor.url;
  // Tokenized URL is accepted only from the SNBM private Supabase Storage
  // origin. Never write this URL to the spreadsheet or to logs.
  if (source.indexOf(SNBM_ARCHIVE.sourcePrefix) !== 0 ||
      !/[?&]token=[^&]+/.test(source) ||
      /[\\\s]/.test(source)) {
    throw new Error('HOST_ARCHIVE_UNTRUSTED_SOURCE');
  }
  const uuid = String(record.id || '').toLowerCase();
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(uuid)) {
    throw new Error('HOST_ARCHIVE_BAD_ID');
  }
  const extension = String(descriptor.name).split('.').pop().toLowerCase();
  const supported = kind === 'cv' ? ['pdf','doc','docx'] : ['mp4','mov','webm'];
  if (supported.indexOf(extension) === -1) throw new Error('HOST_ARCHIVE_BAD_EXTENSION');
  const name = (kind === 'cv' ? 'CV_' : 'Video_') + uuid + '.' + extension;
  const folder = archiveHostFolder_();
  // Retries must not duplicate files when a prior upload succeeded.
  const matches = folder.getFilesByName(name);
  if (matches.hasNext()) {
    const existing = matches.next();
    return 'https://drive.google.com/file/d/' + existing.getId() + '/view';
  }
  const response = UrlFetchApp.fetch(source, {
    muteHttpExceptions: true,
    followRedirects: false
  });
  if (response.getResponseCode() !== 200) throw new Error('HOST_ARCHIVE_DOWNLOAD_FAILED');
  const blob = response.getBlob().setName(name);
  if (blob.getBytes().length === 0) throw new Error('HOST_ARCHIVE_EMPTY_FILE');
  const created = folder.createFile(blob);
  // Intentionally restricted: Google Drive access is granted to the owner
  // and any individuals the owner explicitly shares the folder with.
  return 'https://drive.google.com/file/d/' + created.getId() + '/view';
}

/** Run once to authorize Drive access and initialize the private folder. */
function verifySNBMHostDrive() {
  const tab = SpreadsheetApp.openById(SNBM_SHEET.spreadsheetId)
    .getSheetByName(SNBM_SHEET.hostTab);
  if (!tab) throw new Error('HOST_TAB_NOT_FOUND');
  const folder = archiveHostFolder_();
  Logger.log('Host Drive archiving ready: ' + folder.getName());
}
