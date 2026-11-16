import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/pages.fixture';
import type { Page } from '@playwright/test';

async function inspect(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  // Report mein poori details attach karo
  await test.info().attach('axe-violations', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  // Terminal mein padhne layak summary
  for (const v of results.violations) {
    console.log(`${v.impact} | ${v.id} | ${v.help} | ${v.nodes.length} element(s)`);
  }
  return results.violations;
}

test.describe('Accessibility', { tag: '@a11y' }, () => {
  test.describe('Login page', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('login page has no WCAG A/AA violations', async ({ loginPage, page }) => {
      await loginPage.open();
      expect(await inspect(page)).toEqual([]);
    });
  });

  test('inventory page has no WCAG A/AA violations', async ({ inventory, page }) => {
    await inventory.open();
    expect(await inspect(page)).toEqual([]);
  });
});