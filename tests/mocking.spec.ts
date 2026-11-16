import { test, expect } from '../fixtures/pages.fixture';

test('shows fruits from a fake supplier', async ({ page }) => {
  // Replace the real API response with mocked data
  await page.route('*/**/api/v1/fruits', async (route) => {
    await route.fulfill({
      json: [{ name: 'Strawberry', id: 21 }],
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Strawberry')).toBeVisible();
});

test('adds a fruit to the real supplier list', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async (route) => {
    const response = await route.fetch(); // fetch the real response
    const json = await response.json();
    json.push({ name: 'Litchi', id: 100 }); // append an extra item
    await route.fulfill({ response, json }); // return the modified response
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Litchi')).toBeVisible();
});

test('shows a friendly error when supplier fails', async ({ fruitsApiDown }) => {
  test.fail(true, 'BUG-102: Infinite "Loading..." when fruits API returns 500');

  await fruitsApiDown.goto('https://demo.playwright.dev/api-mocking');
  await expect(fruitsApiDown.getByText(/error|try again|something went wrong/i)).toBeVisible();
});
