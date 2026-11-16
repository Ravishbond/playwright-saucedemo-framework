import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { test as base, type Page } from '@playwright/test';

// 📋 HR ki list: kaun-kaun se receptionist available hain
type MyPages = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
  cartWithBackpack: InventoryPage;
  fruitsApiDown: Page;
};

// 🏢 HR department: Playwright ke "test" ko extend karke apna test banaya
export const test = base.extend<MyPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));     // receptionist banao aur test ko de do
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
  await inventory.open();                            // 1️⃣ products hall kholo
  await inventory.addToCart('sauce-labs-backpack');  // 2️⃣ backpack daalo (SETUP)
  await use(inventory);                              // 3️⃣ ready receptionist test ko do 🚪
},

fruitsApiDown: async ({ page }, use) => {
  // SETUP: supplier ko tod do 💥
  await page.route('*/**/api/v1/fruits', (route) =>
    route.fulfill({ status: 500, body: 'Server crashed' })
  );
  await use(page);   // tuta-supplier wala page test ko do 🚪
},
  
});

export { expect } from '@playwright/test';