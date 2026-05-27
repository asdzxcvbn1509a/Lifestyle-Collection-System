// Wrap async route handlers so thrown errors / rejections reach Express's
// error middleware (needed on Express 4, which doesn't catch async throws).
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
