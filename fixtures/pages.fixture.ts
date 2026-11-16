import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { test as base, type Page } from '@playwright/test';

type MyPages = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
  cartWithBackpack: InventoryPage;
  fruitsApiDown: Page;
};

// Extends Playwright's test with page objects and pre-built states
export const test = base.extend<MyPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventory: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  cartWithBackpack: async ({ inventory }, use) => {
    await inventory.open();
    await inventory.addToCart('sauce-labs-backpack');
    await use(inventory);
  },

  fruitsApiDown: async ({ page }, use) => {
    // Make the fruits API return 500
    await page.route('*/**/api/v1/fruits', (route) => route.fulfill({ status: 500, body: 'Server crashed' }));
    await use(page);
  },
});

export { expect } from '@playwright/test';
