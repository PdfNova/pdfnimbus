export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export function isFileTooLarge(file: File, maxBytes = MAX_FILE_SIZE_BYTES) {
  return file.size > maxBytes;
}

export function formatFileLimit(maxBytes = MAX_FILE_SIZE_BYTES) {
  return `${Math.round(maxBytes / (1024 * 1024))}MB`;
}
