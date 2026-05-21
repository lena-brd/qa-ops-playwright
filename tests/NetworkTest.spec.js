import { test, expect, request } from '@playwright/test';
const { APIUtils } = require('../utils/APIUtils.js');
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const loginPayload = {
  userEmail: email,
  userPassword: password,
};

const orderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '6960eae1c941646b7a8b3ed3' }],
};

const fakePayloadOrders = { data: [], message: 'No Orders' };

let response;
let orderId;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test('Add an item to the cart', async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client/');

  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    async (route) => {
      const apiResponse = await page.request.fetch(route.request());
      const body = JSON.stringify(fakePayloadOrders);
      await route.fulfill({ response: apiResponse, body });
    },
  );

  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForResponse(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
  );
  console.log(await page.locator('.mt-4').textContent());
  // await page.pause();

  // await page.locator('tbody').waitFor();
  // const rows = await page.locator('tbody tr');
});
