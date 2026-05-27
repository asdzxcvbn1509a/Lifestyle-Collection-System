import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration tests share one PostgreSQL DB and global system settings
    // (admin test toggles allowRegistration), so run test files sequentially.
    fileParallelism: false,
  },
});
