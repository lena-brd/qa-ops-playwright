import { test, expect, request } from '@playwright/test';
const { APIUtils } = require('../utils/APIUtils');
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// for login
const loginPayload = {
  userEmail: email,
  userPassword: password,
};

// for orders
const orderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '6960eae1c941646b7a8b3ed3' }],
};

let response;
let orderId;

test.beforeAll(async () => {
  // login API
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test('Add an item to the cart', async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator('button[routerlink*="myorders"]').click();
  await page.locator('tbody').waitFor();
  const rows = await page.locator('tbody tr');

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator('.col-text').textContent();
  // await page.pause();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});

// verify if order created is showning in history oage
// precondition - create order -
