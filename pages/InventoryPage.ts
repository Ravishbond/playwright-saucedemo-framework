import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  // Kaam 1: koi bhi product cart mein daalo
  async addToCart(productId: string) {
  await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
}

  // Cart mein pade product ka "Remove" button
  removeButton(productId: string) {
    return this.page.locator(`[data-test="remove-${productId}"]`);
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

  // Sort dropdown ka "address"
  sortDropdown() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  // Dropdown ke upar dikhne wala selected label
  activeSort() {
    return this.page.locator('[data-test="active-option"]');
  }

  // Kaam 4: sort option chuno (az | za | lohi | hilo)
  async selectSort(option: SortOption) {
    await this.sortDropdown().selectOption(option);
  }

  // Kaam 5: screen par jis order mein products hain, unke naam
  async productNames() {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  // Kaam 6: usi order mein prices, number bana ke ("$29.99" -> 29.99)
  async productPrices() {
  const prices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
  return prices.map((p) => Number(p.replace(/[^0-9.]/g, '')));
}
}

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';