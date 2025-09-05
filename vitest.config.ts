import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/pages/**/*.{js,ts,tsx}',
        'src/setupTests.{js,ts}',
        'src/**/*.d.ts',
      ],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
