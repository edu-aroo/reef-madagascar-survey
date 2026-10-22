/**
 * Google Apps Script – receives survey answers from the web form and
 * appends one row per submission to the "Reponses" sheet.
 *
 * Setup (see GUIDE.md, step 2):
 *  1. Create a Google Sheet  ->  Extensions > Apps Script
 *  2. Paste this file, save, run `setup` once (authorise when asked)
 *  3. Deploy > New deployment > Web app
 *       Execute as: Me   |   Who has access: Anyone
 *  4. Copy the /exec URL into CONFIG.SCRIPT_URL in index.html
 *
 * New fields sent by the form are added automatically as new columns,
 * so you can change the questionnaire without touching this script.
 */

const SHEET_NAME = 'Reponses';
const NOTIFY_EMAIL = '';   // optional: your e-mail to receive a notification per response

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['received_at', 'submission_id', 'submitted_at_client', 'survey_version']);
    sh.setFrozenRows(1);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                       // avoid two submissions writing the same row
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return out_({ status: 'ignored' });   // honeypot (spam)

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { setup(); sh = ss.getSheetByName(SHEET_NAME); }

    // Current header; append any new keys as new columns
    let headers = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].filter(String);
    const newKeys = Object.keys(data).filter(k => k !== 'website' && headers.indexOf(k) === -1);
    if (newKeys.length) {
      sh.getRange(1, headers.length + 1, 1, newKeys.length).setValues([newKeys]);
      headers = headers.concat(newKeys);
    }

    data.received_at = new Date();
    // Store everything as text (prefix ') so Sheets does not reformat e.g. "1–3" or "2; 3"
    const row = headers.map(h => {
      const v = data[h];
      if (v === undefined || v === null || v === '') return '';
      if (h === 'received_at') return v;
      return typeof v === 'string' ? "'" + v : v;
    });
    sh.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Nouvelle réponse – enquête récifs',
        'Organisation : ' + (data.q001 || '?') + '\nRéférence : ' + data.submission_id);
    }
    return out_({ status: 'ok', id: data.submission_id });
  } catch (err) {
    return out_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out_({ status: 'ok', message: 'Survey endpoint is running.' });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
