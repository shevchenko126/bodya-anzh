const MIME_PATTERN = /^[\w.+-]+\/[\w.+-]+$/;

/**
 * iOS Safari іноді віддає File з "type", який не є справжнім MIME —
 * порожній рядок або внутрішній UTI-ідентифікатор (наприклад, для HEIC-фото
 * з Live Photos чи вибраних через "Файли"). Такий "type" ламає серіалізацію
 * multipart-запиту у fetch() з помилкою
 * "TypeError: The string did not match the expected pattern.",
 * і фото з айфона просто не відправлялося. Підміняємо тип на безпечний
 * перед відправкою — сервер сам розбереться, як краще переслати файл.
 */
export function sanitizeFile(file: File): File {
  if (MIME_PATTERN.test(file.type)) return file;
  return new File([file], file.name, { type: "application/octet-stream" });
}

/**
 * Не показуємо гостям сирий текст технічної помилки браузера (наприклад,
 * той самий "did not match the expected pattern") — тільки повідомлення,
 * які ми самі сформували (`throw new Error(...)` з відповіді сервера).
 */
export function friendlyErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.constructor === Error) return err.message;
  return fallback;
}
