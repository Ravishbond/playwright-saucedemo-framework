import { test, expect } from '../fixtures/pages.fixture';
import { env } from '../utils/env';

test.describe('Visual checks', { tag: '@visual' }, () => {
  test('inventory page looks right', async ({ inventory, page }) => {
    await inventory.open();
    await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
  });

  test.describe('visual_user', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test.fail(true, 'BUG-103: visual_user inventory layout differs from baseline');

    test('visual_user sees the same page', async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(env.visualUser, env.password);
      await expect(page).toHaveURL(/inventory/);
      await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
    });
  });
});