import { test as setup, expect } from '../fixtures/pages.fixture';
import { env } from '../utils/env';

const authFile = 'playwright/.auth/user.json';

setup('login once and save storage state', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.login(env.standardUser, env.password);
  await expect(page).toHaveURL(/inventory/);

  // Save cookies and local storage for reuse by other projects
  await page.context().storageState({ path: authFile });
});
