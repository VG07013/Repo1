const SHEET_NAME = "Responses";
const HEADERS = ["Timestamp", "Name", "Email", "Phone"];
const NAME_REGEX = /^[A-Za-z ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d+$/;

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
    const fullName = clean_(e.parameter.fullName);
    const email = clean_(e.parameter.email);
    const phone = clean_(e.parameter.phone);

    if (!fullName || !phone) {
      return response_({
        ok: false,
        error: "Name and phone are required.",
      });
    }

    if (!NAME_REGEX.test(fullName)) {
      return response_({
        ok: false,
        error: "Name can contain only letters and spaces.",
      });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return response_({
        ok: false,
        error: "Email must be blank or in a valid format.",
      });
    }

    if (!PHONE_REGEX.test(phone)) {
      return response_({
        ok: false,
        error: "Phone number can contain digits only.",
      });
    }

    sheet.appendRow([new Date(), fullName, email, phone]);

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
