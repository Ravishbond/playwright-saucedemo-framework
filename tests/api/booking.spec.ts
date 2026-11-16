import { test, expect } from '@playwright/test';
import { env } from '../../utils/env';
test.use({
  baseURL: process.env.API_BASE_URL,
  extraHTTPHeaders: { Accept: 'application/json' },
});

test('full booking lifecycle: create → update → delete', async ({ request }) => {
  // 1️⃣ Staff login: token lo 🪪
  const authRes = await request.post('/auth', {
    data: { username: env.apiUser, password: env.apiPassword },
  });
  const { token } = await authRes.json();

  // 2️⃣ Booking banao
  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Ravish', lastname: 'Test', totalprice: 500, depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    },
  });
  const { bookingid } = await createRes.json();

  // 3️⃣ Booking badlo (naam Priya, price 900), token ke saath
  const updateRes = await request.put(`/booking/${bookingid}`, {
    headers: { Cookie: `token=${token}` },
    data: {
      firstname: 'Priya', lastname: 'Test', totalprice: 900, depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    },
  });
  
  expect(updateRes.status()).toBe(200);
    const json = await updateRes.json(); 
    expect(json.firstname).toMatch('Priya')


  // 4️⃣ Booking cancel karo
  const deleteRes = await request.delete(`/booking/${bookingid}`, {
    headers: { Cookie: `token=${token}` },
  });

   expect(deleteRes.status()).toBe(201);

  // 5️⃣ Cancel hui ya nahi, pakka karo
   const response = await request.get(`/booking/${bookingid}`);
   expect(response.status()).toBe(404);
});

test('cannot delete booking without token', async ({ request }) => {
  // booking banao, phir BINA headers ke delete karo
  // kya status aana chahiye? 401 ya 403? Socho, phir actual dekho!
 // 2️⃣ Booking banao
  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Axar', lastname: 'Test', totalprice: 1000, depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    },
  });
   const { bookingid } = await createRes.json();
   const deleteRes = await request.delete(`/booking/${bookingid}`);
   expect(deleteRes.status()).toBe(403);
   const getRes = await request.get(`/booking/${bookingid}`);
   expect(getRes.status()).toBe(200);
});
   test('create booking with negative price', async ({ request }) => {
  // booking banao, phir BINA headers ke delete karo
  // kya status aana chahiye? 401 ya 403? Socho, phir actual dekho!
 // 2️⃣ Booking banao
 test.fail(true, 'BUG-101: API accepts negative totalprice');
  const createRes = await request.post('/booking', {
    data: {
      firstname: 'Aman', lastname: 'Test', totalprice: -5000, depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    },
    
  });
    expect(createRes.status()).toBe(400);
})


  
