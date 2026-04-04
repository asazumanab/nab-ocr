function doPost(e) {
  try {
    const payload = parsePayload_(e);
    validatePayload_(payload);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(payload.sheetName) || spreadsheet.insertSheet(payload.sheetName);

    const currentHeaders = getCurrentHeaders_(sheet);
    if (!currentHeaders.length) {
      sheet.getRange(1, 1, 1, payload.headers.length).setValues([payload.headers]);
    } else if (!headersMatch_(currentHeaders, payload.headers)) {
      throw new Error('シートのヘッダーが送信データと一致しません。別シート名を使うか、ヘッダー行を確認してください。');
    }

    if (payload.rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, payload.rows.length, payload.headers.length)
        .setValues(payload.rows);
    }

    return jsonResponse_({
      ok: true,
      appendedRows: payload.rows.length,
      sheetName: sheet.getName(),
      message: payload.rows.length > 0 ? 'スプレッドシートへ追記しました。' : '追記対象の行はありませんでした。'
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error.message || String(error)
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'NAB AI-OCR Apps Script endpoint is running.'
  });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('POSTデータが見つかりません。');
  }

  const raw = e.postData.contents;
  const parsed = JSON.parse(raw);
  return {
    sheetName: String(parsed.sheetName || '').trim(),
    headers: Array.isArray(parsed.headers) ? parsed.headers.map(String) : [],
    rows: Array.isArray(parsed.rows) ? parsed.rows : [],
    exportedAt: parsed.exportedAt || '',
    sourceFileName: parsed.sourceFileName || ''
  };
}

function validatePayload_(payload) {
  if (!payload.sheetName) {
    throw new Error('sheetName が未設定です。');
  }
  if (!payload.headers.length) {
    throw new Error('headers が空です。');
  }
  if (!Array.isArray(payload.rows)) {
    throw new Error('rows の形式が不正です。');
  }

  payload.rows.forEach(function(row, index) {
    if (!Array.isArray(row)) {
      throw new Error('rows[' + index + '] の形式が不正です。');
    }
    if (row.length !== payload.headers.length) {
      throw new Error('rows[' + index + '] の列数が headers と一致しません。');
    }
  });
}

function getCurrentHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    return [];
  }
  const lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) {
    return [];
  }
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
}

function headersMatch_(currentHeaders, incomingHeaders) {
  if (currentHeaders.length !== incomingHeaders.length) {
    return false;
  }
  return currentHeaders.every(function(header, index) {
    return header === incomingHeaders[index];
  });
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
