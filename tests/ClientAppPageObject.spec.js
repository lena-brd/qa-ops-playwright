import { test, expect } from '@playwright/test';
const { PageObjectManager } = require('../pageobjects/PageObjectManager.js');

const dataset = JSON.parse(
  JSON.stringify(require('../utils/placeorderTestData.json')),
);

require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test('Add an item to the cart', async ({ page }) => {
  // js file - Login js page object file, dashboard page
  const pageObjectManager = new PageObjectManager(page);

  const products = page.locator('.card-body');
  // const productName = 'ZARA COAT 3';
  const countryName = 'ind';

  const loginPage = pageObjectManager.getLoginPage();
  await loginPage.goToLoginPage();
  await loginPage.validLogin(email, password);

  const dashboardPage = pageObjectManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(dataset.productName);
  await dashboardPage.navigateToCart();

  const checkoutPage = pageObjectManager.getCheckoutPage();
  // const bool = await checkoutPage.productIsVisible(dataset.productName);
  // expect(bool).toBeTruthy();
  await checkoutPage.submitOrder(countryName);

  // prettier-ignore
  await expect(page.locator('.user__name [type="text"]').first()).toHaveText(email);
  await page.locator('.action__submit').click();

  // prettier-ignore
  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

  const ordersPage = pageObjectManager.getOrdersPage();
  expect(await ordersPage.orderIsPresent()).toBeTruthy();
});
