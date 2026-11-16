import { Page } from '@playwright/test';

export class LoginPage {
  // Receptionist ko shop (page) di
  constructor(private page: Page) {}

  // Kaam 1: shop ka darwaza kholna
  async open() {
    await this.page.goto('/')
  }

  // Kaam 2: login karwana (kisi bhi user ke liye)
  async login(username: string, password: string) {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  // Kaam 3: error message dikhana
  errorMessage() {
    return this.page.locator('[data-test="error"]');
  }
}