import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // SLOWMO=800 npm run test:watch  ->  slows each action so you can follow along
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  testDir: './tests/ui',
  projects: [{ name: 'ui', use: { ...devices['Desktop Chrome'] } }],
});
