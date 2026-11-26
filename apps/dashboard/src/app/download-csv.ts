export function downloadCsv(fileName: string, rows: readonly (readonly (string | number)[])[]) {
  const csv = rows.map((row) => row.map((value) => {
    const cell = typeof value === "string" && (/^\s*[=+@-]/.test(value) || /^[\t\r\n]/.test(value)) ? "'" + value : String(value);
    return '"' + cell.replaceAll('"', '""') + '"';
  }).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
