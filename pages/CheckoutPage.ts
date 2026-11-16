import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  // Kaam 1: form bharo + continue
  async fillDetails(firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
     await this.page.locator('[data-test="lastName"]').fill(lastName);
      await this.page.locator('[data-test="postalCode"]').fill(postalCode);
      await this.page.locator('[data-test="continue"]').click();
  }

  // Kaam 2: order finish karo
  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  // Kaam 3: success message ka "address" (await nahi! 😉)
  successMessage() {
     return this.page.getByText('Thank you for your order!');

   
  }

  errorMessage() {
  return this.page.locator('[data-test="error"]');
}

  
}