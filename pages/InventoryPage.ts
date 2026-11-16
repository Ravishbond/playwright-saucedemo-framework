import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  // Kaam 1: koi bhi product cart mein daalo
  async addToCart(productId: string) {
  await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
}

  // Kaam 2: cart icon ka badge batao (sirf "address", await nahi! 😉)
  cartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  // Kaam 3: cart kholo
  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async open() {
  await this.page.goto('/inventory.html');
}
}