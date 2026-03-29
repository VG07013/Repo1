const SHEET_NAME = "Responses";
const HEADERS = ["Timestamp", "First Name", "Last Name", "Comment"];

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      message: "VGRepo1 Sheet backend is running.",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = getSheet_();
    const firstName = clean_(e.parameter.firstName);
    const lastName = clean_(e.parameter.lastName);
    const comment = clean_(e.parameter.comment);

    if (!firstName || !lastName || !comment) {
      return response_({
        ok: false,
        error: "First name, last name, and comment are required.",
      });
    }

    sheet.appendRow([new Date(), firstName, lastName, comment]);

    return response_({
      ok: true,
      message: "Row added successfully.",
    });
  } catch (error) {
    return response_({
      ok: false,
      error: error.message,
    });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function clean_(value) {
  return String(value || "").trim();
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
