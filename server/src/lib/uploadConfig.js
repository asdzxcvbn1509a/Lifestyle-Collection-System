// Shared upload limits. Kept in its own leaf module so both upload.js
// (sets the limit) and error.js (reports it) can import it without a cycle.
export const MAX_UPLOAD_MB = 10;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
