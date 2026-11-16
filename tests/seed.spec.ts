import { test } from '../fixtures/pages.fixture';

// eslint-disable-next-line playwright/expect-expect
test('seed', async ({ inventory }) => {
  await inventory.open();
});
