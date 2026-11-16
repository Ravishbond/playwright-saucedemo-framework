import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = 'playwright/.auth/user.json';

// UI projects skip API tests. The seed file is only for Playwright Test Agents,
// so it is excluded unless PW_AGENTS is set (the agent MCP server sets it in .mcp.json).
const uiTestIgnore = process.env.PW_AGENTS ? [/api\/.*/] : [/api\/.*/, /seed\.spec\.ts/];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if test.only is left in the source code */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        environmentInfo: {
          BASE_URL: process.env.BASE_URL,
          Node: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    actionTimeout: 10_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'api', testMatch: /api\/.*\.spec\.ts/ },
    {
      name: 'chromium',
      testIgnore: uiTestIgnore,
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: uiTestIgnore,
      use: { ...devices['Desktop Firefox'], storageState: authFile },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testIgnore: uiTestIgnore,
      use: { ...devices['Desktop Safari'], storageState: authFile },
      dependencies: ['setup'],
    },
  ],
});
