import { test, expect } from '@playwright/test';
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test('Add an item to the cart', async ({ page }) => {
  const products = page.locator('.card-body');
  const productName = 'ZARA COAT 3';

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

  await page.getByPlaceholder('email@example.com').fill(email);
  await page.getByPlaceholder('enter your passsword').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('networkidle');

  await page.locator('.card-body b').first().waitFor();
  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);

  await page
    .locator('.card-body')
    .filter({ hasText: 'ZARA COAT 3' })
    .getByRole('button', { name: 'Add To Cart' })
    .click();

  await page
    .getByRole('listitem')
    .getByRole('button', { name: 'Cart' })
    .click();

  // wait till will be loaded li's
  await page.locator('div li').first().waitFor();

  await expect(page.getByText('ZARA COAT 3')).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.locator('[value="4542 9931 9292 2293"]').clear();

  await page.getByPlaceholder('Select Country').pressSequentially('ind');

  await page.getByRole('button', { name: 'India' }).nth(1).click();

  await page.getByText('PLACE ORDER').click();

  await expect(page.getByText(' Thankyou for the order.')).toBeVisible();
  // prettier-ignore
  const orederId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
  console.log(orederId);

  // await page.locator('button[routerlink*="myorders"]').click();
  // prettier-ignore
  await page.getByRole('listitem').getByRole('button', {name: 'ORDERS'}).click()
  await page.locator('tbody').waitFor();

  const rows = await page.locator('tbody tr');

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orederId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(orederId.includes(orderIdDetails)).toBeTruthy();
});
