// spec: specs/sorting.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures/pages.fixture';
import { env } from '../utils/env';
import type { SortOption } from '../pages/InventoryPage';

const byName = (a: string, b: string) => a.localeCompare(b);
const byPrice = (a: number, b: number) => a - b;

const cases: {
  option: SortOption;
  label: string;
  check: (names: string[], prices: number[]) => void;
}[] = [
  {
    option: 'az',
    label: 'Name (A to Z)',
    check: (names) => expect(names).toEqual([...names].sort(byName)),
  },
  {
    option: 'za',
    label: 'Name (Z to A)',
    check: (names) => expect(names).toEqual([...names].sort(byName).reverse()),
  },
  {
    option: 'lohi',
    label: 'Price (low to high)',
    check: (_names, prices) => expect(prices).toEqual([...prices].sort(byPrice)),
  },
  {
    option: 'hilo',
    label: 'Price (high to low)',
    check: (_names, prices) => expect(prices).toEqual([...prices].sort(byPrice).reverse()),
  },
];

test.describe('Inventory sorting', { tag: '@sorting' }, () => {
  test.beforeEach(async ({ inventory }) => {
    await inventory.open();
  });

  test('dropdown has exactly 4 options in order', async ({ inventory }) => {
    const options = inventory.sortDropdown().locator('option');
    await expect(options).toHaveCount(4);
    await expect(options).toHaveText(cases.map((c) => c.label));
    const values = await options.evaluateAll((els) => els.map((el) => (el as HTMLOptionElement).value));
    expect(values).toEqual(cases.map((c) => c.option));
  });

  test('default sort is Name (A to Z)', async ({ inventory }) => {
    await expect(inventory.sortDropdown()).toHaveValue('az');
    await expect(inventory.activeSort()).toHaveText('Name (A to Z)');
    const names = await inventory.productNames();
    expect(names).toHaveLength(6);
    expect(names).toEqual([...names].sort(byName));
  });

  for (const { option, label, check } of cases) {
    test(`sort by ${label}`, async ({ inventory }) => {
      // Select a different option first so the change is real (page defaults to az)
      await inventory.selectSort(option === 'az' ? 'za' : 'az');
      await inventory.selectSort(option);
      await expect(inventory.sortDropdown()).toHaveValue(option);
      await expect(inventory.activeSort()).toHaveText(label);

      const names = await inventory.productNames();
      const prices = await inventory.productPrices();
      expect(prices.every(Number.isFinite)).toBe(true);
      expect(names).toHaveLength(6);
      expect(prices).toHaveLength(6);
      check(names, prices);
    });
  }

  test('name and price pairing is preserved for every sort', async ({ inventory }) => {
    const readPairs = async () => {
      const names = await inventory.productNames();
      const prices = await inventory.productPrices();
      return Object.fromEntries(names.map((n, i) => [n, prices[i]]));
    };

    const original = await readPairs();
    expect(Object.keys(original)).toHaveLength(6);

    for (const { option, label } of cases) {
      await inventory.selectSort(option);
      await expect(inventory.activeSort()).toHaveText(label);
      expect(await readPairs()).toEqual(original);
    }
  });

  test('cart stays intact after sorting', async ({ inventory }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.selectSort('hilo');
    await expect(inventory.activeSort()).toHaveText('Price (high to low)');
    await expect(inventory.cartBadge()).toHaveText('1');
    await expect(inventory.removeButton('sauce-labs-backpack')).toBeVisible();

    await inventory.addToCart('sauce-labs-onesie');
    await expect(inventory.cartBadge()).toHaveText('2');
  });
});

// Separate describe: logs in as problem_user instead of using the standard_user storage state
test.describe('Inventory sorting: problem_user', { tag: '@sorting' }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.fail(
    true,
    'BUG-104: problem_user sort dropdown ignores selection, reverts to Name (A to Z) and list order never changes',
  );

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(env.problemUser, env.password);
    await expect(page).toHaveURL(/inventory/);
  });

  for (const { option, label, check } of cases.filter((c) => c.option === 'za' || c.option === 'hilo')) {
    test(`problem_user sort by ${label}`, async ({ inventory }) => {
      await inventory.selectSort(option);
      await expect(inventory.sortDropdown()).toHaveValue(option);
      await expect(inventory.activeSort()).toHaveText(label);

      const names = await inventory.productNames();
      const prices = await inventory.productPrices();
      expect(prices.every(Number.isFinite)).toBe(true);
      expect(names).toHaveLength(6);
      check(names, prices);
    });
  }
});
