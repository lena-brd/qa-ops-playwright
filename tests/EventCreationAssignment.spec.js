import { expect, test } from '@playwright/test';
require('dotenv').config();

const email = process.env.EMAIL_EVENTHUB;
const password = process.env.PASSWORD_EVENTHUB;

function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 16);
}

test('Full booking flow with event creation assignment', async ({ page }) => {
  // Step 1 — Login
  await page.goto('https://eventhub.rahulshettyacademy.com/login');

  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('password').fill(password);
  await page.locator('#login-btn').click();
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('link', { name: 'Browse Events →' }),
  ).toBeVisible();

  // step 2
  await page.goto('https://eventhub.rahulshettyacademy.com/admin/events');

  const title = `Test Event ${Date.now()}`;
  await page.locator('#event-title-input').fill(title);
  await page.locator('#admin-event-form textarea').fill('Random desciption');
  await page.getByLabel('City').fill('Bratislava');
  await page.getByLabel('Venue').fill('Concert Hall');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');
  await page.locator('#add-event-btn').click();
  await expect(page.getByText('Event created!')).toBeVisible();

  // Step 3 — Find the event card and capture seats
  await page.goto('https://eventhub.rahulshettyacademy.com/events');

  const allEventsCards = await page.locator('[data-testid="event-card"]');
  await expect(allEventsCards.nth(0)).toBeVisible();
  const firstCard = allEventsCards.filter({ hasText: title });
  await expect(firstCard).toBeVisible({ timeout: 5000 });
  const seatText = await firstCard
    .locator(':text(" seats available")')
    .innerText();
  const seatsBeforeBooking = parseInt(seatText);

  // Step 4 — Start booking
  await firstCard.locator('#book-now-btn').click();

  // Step 5 — Fill booking form
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByLabel('Full Name').fill('Jane Stitch');
  await page.locator('#customer-email').fill('example@exampl.com');
  await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');
  await page.locator('#confirm-booking').click();

  // Step 6 — Verify booking confirmation
  const bookingRef = page.locator('.booking-ref').first();
  await expect(bookingRef).toBeVisible();
  const bookingRefText = await bookingRef.innerText();
  console.log(bookingRefText.trim());

  // Step 7 — Verify in My Bookings
  await page.getByRole('button', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(
    'https://eventhub.rahulshettyacademy.com/bookings',
  );
  const allBookingsCards = await page.locator('#booking-card');
  await expect(allBookingsCards.first()).toBeVisible();
  const matchedBooking = allBookingsCards.filter({ hasText: bookingRefText });
  await expect(matchedBooking).toContainText(title);

  // Step 8 — Verify seat reduction
  await page.goto('https://eventhub.rahulshettyacademy.com/events');
  await expect(allEventsCards.nth(0)).toBeVisible();
  const matchedCardTitle = allBookingsCards.filter({ hasText: title });
});
