import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';

test.use({
  baseURL: process.env.API_BASE_URL,
  extraHTTPHeaders: { Accept: 'application/json' },
});

const bookingDates = { checkin: '2026-12-01', checkout: '2026-12-05' };

test('full booking lifecycle: create → update → delete', async ({ request }) => {
  // Authenticate and get a token
  const authRes = await request.post('/auth', {
    data: { username: env.apiUser, password: env.apiPassword },
  });
  expect(authRes.ok()).toBe(true);
  const { token } = await authRes.json();
  expect(token).toBeTruthy();

  // Create a booking
  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Ravish',
      lastname: 'Test',
      totalprice: 500,
      depositpaid: true,
      bookingdates: bookingDates,
    },
  });
  expect(createRes.ok()).toBe(true);
  const { bookingid } = await createRes.json();

  // Update the booking (authenticated)
  const updateRes = await request.put(`/booking/${bookingid}`, {
    headers: { Cookie: `token=${token}` },
    data: {
      firstname: 'Priya',
      lastname: 'Test',
      totalprice: 900,
      depositpaid: true,
      bookingdates: bookingDates,
    },
  });
  expect(updateRes.status()).toBe(200);
  const json = await updateRes.json();
  expect(json.firstname).toBe('Priya');

  // Delete the booking (API returns 201 on success)
  const deleteRes = await request.delete(`/booking/${bookingid}`, {
    headers: { Cookie: `token=${token}` },
  });
  expect(deleteRes.status()).toBe(201);

  // Confirm it no longer exists
  const response = await request.get(`/booking/${bookingid}`);
  expect(response.status()).toBe(404);
});

test('cannot delete booking without token', async ({ request }) => {
  // Create a booking, then try to delete it without auth
  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Axar',
      lastname: 'Test',
      totalprice: 1000,
      depositpaid: true,
      bookingdates: bookingDates,
    },
  });
  const { bookingid } = await createRes.json();

  const deleteRes = await request.delete(`/booking/${bookingid}`);
  expect(deleteRes.status()).toBe(403);

  // Booking must still exist
  const getRes = await request.get(`/booking/${bookingid}`);
  expect(getRes.status()).toBe(200);
});

test('rejects booking with negative price', async ({ request }) => {
  test.fail(true, 'BUG-101: API accepts negative totalprice');

  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Aman',
      lastname: 'Test',
      totalprice: -5000,
      depositpaid: true,
      bookingdates: bookingDates,
    },
  });
  expect(createRes.status()).toBe(400);
});
