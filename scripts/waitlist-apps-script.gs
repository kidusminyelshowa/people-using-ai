/**
 * People using ai — launch waitlist.
 * Receives emails from the coming-soon page and adds them to this sheet.
 *
 * Setup (once):
 *  1. Create a Google Sheet, e.g. "People using ai — Waitlist".
 *  2. Extensions > Apps Script. Replace the code with this file and save.
 *  3. Deploy > New deployment > type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Authorise when asked, then copy the Web app URL (ends in /exec).
 *  4. Put that URL in the site's environment as VITE_WAITLIST_URL
 *     (.env locally, and in the hosting provider's settings), then rebuild.
 *
 * The sheet itself stays private: "Anyone" can only call this script,
 * which only appends a row. If you change the code later, use
 * Deploy > Manage deployments > Edit > New version so the URL stays the same.
 */
const SHEET_NAME = "Waitlist";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "").slice(0, 60);
    if (!EMAIL.test(email) || email.length > 254) return reply({ ok: false, error: "invalid" });

    const sheet = getSheet();
    const last = sheet.getLastRow();
    const known = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues().flat() : [];
    if (known.indexOf(email) === -1) sheet.appendRow([new Date(), email, source]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: "server" });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(["Signed up", "Email", "Source"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
