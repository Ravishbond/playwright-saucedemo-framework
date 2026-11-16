import { test as setup, expect } from '../fixtures/pages.fixture';
import { env } from '../utils/env';

const authFile = 'playwright/.auth/user.json';   // VIP pass yahan save hoga

setup('login once and save VIP pass', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.login(env.standardUser, env.password);
  await expect(page).toHaveURL(/inventory/);

  // 🎟️ Browser ki yaaddasht (cookies + storage) file mein save karo
  await page.context().storageState({ path: authFile });
  
});
