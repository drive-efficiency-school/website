import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4173'
const isExternalTarget = baseURL.startsWith('http://localhost') === false

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Off: failure video needs Playwright's own downloaded ffmpeg, which the house rule
    // forbids (no `npx playwright install`). Failure screenshots + traces stay on.
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      // House rule: run on the Mac's installed Google Chrome — never download Playwright's
      // bundled browsers (`npx playwright install`). The bundled headless shell went missing
      // on every Playwright update and failed the whole suite at launch.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    }
  ],
  webServer: isExternalTarget
    ? undefined
    : {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173',
        timeout: 120_000,
        reuseExistingServer: !process.env.CI
      }
})
