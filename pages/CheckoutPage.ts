import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  // Fill the customer form and continue
  async fillDetails(firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
  }

  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  successMessage() {
    return this.page.getByText('Thank you for your order!');
  }

  errorMessage() {
    return this.page.locator('[data-test="error"]');
  }
}
