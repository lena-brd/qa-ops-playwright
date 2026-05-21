import { test, expect, request } from '@playwright/test';
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test('Security test request intercept', async ({ page }) => {
  // login and reach orders page
  const products = page.locator('.card-body');
  const productName = 'ZARA COAT 3';

  await page.goto('https://rahulshettyacademy.com/client');

  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();
  await page.waitForLoadState('networkidle');
  await page.locator('.card-body b').first().waitFor();

  await page.locator("button[routerlink*='myorders']").click();
  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
    (route) =>
      route.continue({
        url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6',
      }),
  );
  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator('p').last()).toHaveText(
    'You are not authorize to view this order',
  );
});
