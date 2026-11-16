import { test, expect } from '../fixtures/pages.fixture';
import { env } from '../utils/env';
import customers from '../test-data/customers.json';

test.describe('Without login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
test('locked out user sees error', async ({loginPage}) => {
  // receptionist hire kiya
  await loginPage.open();                              // darwaza khola
  await loginPage.login(env.lockedUser, env.password);   // login karwaya
  await expect(loginPage.errorMessage()).toContainText('locked out');
});
});



 
test.describe('Logged-in customer', () => {

  test.beforeEach(async ({ inventory, page }) => {
    // receptionist hire kiya
    await inventory.open()              
    await expect(page).toHaveURL(/inventory/);
  });

  // 👇 yahan tests aayenge (login lines ke bina)
  test('customer can add backpack to cart', async ({ inventory }) => {
  // 4. Backpack cart mein daalo
  await inventory.addToCart('sauce-labs-backpack');

  // 5. CHECK: cart pe "1" dikhna chahiye
  await expect(inventory.cartBadge()).toHaveText('1');
});
test('full shopping trip', { tag: '@smoke' }, async ({ inventory, cart, checkout,page }) => {
  await test.step('Add 2 items to cart', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');
    await expect(inventory.cartBadge()).toHaveText('2');
  });

  await test.step('Go to checkout', async () => {
    await inventory.openCart();
    await cart.checkout();
  });

  await test.step('Fill details and place order', async () => {
    await checkout.fillDetails('Ravish', 'Test', '282007'); 
    await expect(page).toHaveURL(/checkout-step-two/); 
    await checkout.finish();
    await expect(checkout.successMessage()).toBeVisible();
  });
});
for (const customer of customers.valid) {
  test(`checkout works for ${customer.firstName}`, async ({ inventory, cart, checkout }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillDetails(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.finish();
    await expect(checkout.successMessage()).toBeVisible();
  });
}
  for (const customer of customers.invalid) {
  test(`shows error: ${customer.expectedError}`, async ({ inventory, cart, checkout }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillDetails(customer.firstName, customer.lastName, customer.postalCode);
     await expect(checkout.errorMessage()).toContainText(customer.expectedError);
});
  }
  test('backpack is already in cart', async ({ cartWithBackpack }) => {
  await expect(cartWithBackpack.cartBadge()).toHaveText('1');
});

})