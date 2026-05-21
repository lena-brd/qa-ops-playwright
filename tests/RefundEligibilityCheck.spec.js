/*
What you are testing: Two separate tests — one booking with 1 ticket should show "Eligible for refund", 
a booking with 3 tickets should show "Not eligible for refund". Both tests verify the spinner appears 
and disappears before showing the result.
*/
import { expect, test } from '@playwright/test';
import { expectFailure } from 'node:test';
require('dotenv').config();

// setup
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const email = process.env.EMAIL_EVENTHUB;
const password = process.env.PASSWORD_EVENTHUB;

async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByPlaceholder('••••••').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible;
}

test('Single ticket booking is eligible for refund', async ({ page }) => {
  await loginAndGoToBooking(page);
  await page.waitForLoadState('networkidle');

  // Step 2 — Book first event with 1 ticket (default)
  await page.goto(`${BASE_URL}/events`);
  const firstCard = page.locator('[data-testid="event-card"]').first();
  await firstCard.locator('[data-testid="book-now-btn"]').click();
  await page.getByPlaceholder('Your full name').fill('Jane Smith');
  await page.getByPlaceholder('you@email.com').fill('example@example.com');
  await page.getByPlaceholder('+91 98765 43210').fill('919876543210');
  await page.locator('#confirm-booking').click();

  // Step 3 — Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  const firstBookingCard = page.locator('[data-testid="booking-card"]').first();
  await firstBookingCard.getByRole('button', { name: 'View Details' }).click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  // Step 4 — Validate booking ref
  // prettier-ignore
  const bookingRef = await page.locator('[class="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm"]').textContent();
  const bookingTitle = await page.locator('div h1').textContent();
  await expect(bookingRef.trim()[0]).toBe(bookingTitle.trim()[0]);

  // Step 5 — Check refund eligibility
  await page
    .getByRole('button', { name: 'Check eligibility for refund?' })
    .click({ timeout: 4000 });

  // Wait for spinner to appear
  const spinner = page.locator('#refund-spinner');
  await expect(spinner).toBeVisible({ timeout: 5000 });

  // Step 6 — Validate result
  await expect(page.locator('#refund-result')).toBeVisible();
  // prettier-ignore
  await expect(page.locator('#refund-result').filter({ hasText: 'Eligible for refund.' })).toBeVisible();
  // prettier-ignore
  await expect(page.locator('#refund-result').filter({ hasText: 'Single-ticket bookings qualify for a full refund' })).toBeVisible();
});

test('Group ticket booking is NOT eligible for refund', async ({ page }) => {
  await loginAndGoToBooking(page);
  await page.waitForLoadState('networkidle');

  await page.goto(`${BASE_URL}/events`);
  const firstCard = page.locator('[data-testid="event-card"]').first();
  await firstCard.locator('[data-testid="book-now-btn"]').click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('Your full name').fill('Jane Smith');
  await page.getByPlaceholder('you@email.com').fill('example@example.com');
  await page.getByPlaceholder('+91 98765 43210').fill('919876543210');
  await page.locator('#confirm-booking').click();

  // Step 3 — Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  const firstBookingCard = page.locator('[data-testid="booking-card"]').first();
  await firstBookingCard.getByRole('button', { name: 'View Details' }).click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  // Step 4 — Validate booking ref
  // prettier-ignore
  const bookingRef = await page.locator('[class="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm"]').textContent();
  const bookingTitle = await page.locator('div h1').textContent();
  await expect(bookingRef.trim()[0]).toBe(bookingTitle.trim()[0]);

  // Step 5 — Check refund eligibility
  await page
    .getByRole('button', { name: 'Check eligibility for refund?' })
    .click({ timeout: 4000 });

  // Wait for spinner to appear
  const spinner = page.locator('#refund-spinner');
  await expect(spinner).toBeVisible({ timeout: 5000 });

  // Step 6 — Validate result
  await expect(page.locator('#refund-result')).toBeVisible();
  // prettier-ignore
  await expect(page.locator('#refund-result').filter({ hasText: 'Not eligible for refund.' })).toBeVisible();
  // prettier-ignore
  await expect(page.locator('#refund-result').filter({ hasText: 'Group bookings (3 tickets) are non-refundable.' })).toBeVisible();
});
