import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productId: string) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  // "Remove" button for a product already in the cart
  removeButton(productId: string) {
    return this.page.locator(`[data-test="remove-${productId}"]`);
  }

  cartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async open() {
    await this.page.goto('/inventory.html');
  }

  sortDropdown() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  // Label showing the currently selected sort option
  activeSort() {
    return this.page.locator('[data-test="active-option"]');
  }

  async selectSort(option: SortOption) {
    await this.sortDropdown().selectOption(option);
  }

  // Product names in display order
  async productNames() {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  // Product prices in display order, as numbers ("$29.99" -> 29.99)
  async productPrices() {
    const prices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return prices.map((p) => Number(p.replace(/[^0-9.]/g, '')));
  }
}

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
