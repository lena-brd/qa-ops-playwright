const { Given, When, Then } = require('@cucumber/cucumber');
const { PageObjectManager } = require('../../pageobjects/PageObjectManager.js');
// const { test, expect, playwright } = require('@playwright/test');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

// const dataset = JSON.parse(
//   JSON.stringify(require('../../utils/placeorderTestData.json')),
// );

// prettier-ignore
Given('a login to Ecommerce application with {string} and {string}', async function (email, password) {
    // Write code here that turns the phrase above into concrete actions
    // const browser = await chromium.launch();
    // const context = await browser.newContext();
    // this.page = await context.newPage();
    this.email = email;

    // this.pageObjectManager = new PageObjectManager(this.page);
    const products = this.page.locator('.card-body');
    this.countryName = 'ind';

    const loginPage = this.pageObjectManager.getLoginPage();
    await loginPage.goToLoginPage();
    await loginPage.validLogin(email, password);
});

When('Add {string} to cart', async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  this.dashboardPage = this.pageObjectManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the cart', async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  this.checkoutPage = this.pageObjectManager.getCheckoutPage();
  const bool = await this.checkoutPage.productIsVisible(productName);
  expect(bool).toBeTruthy();
});

When('Enter valid details and place the order', async function () {
  // Write code here that turns the phrase above into concrete actions
  await this.checkoutPage.submitOrder(this.countryName);
  await expect(
    this.page.locator('.user__name [type="text"]').first(),
  ).toHaveText(this.email);
  await this.page.locator('.action__submit').click();
  // prettier-ignore
  await expect(this.page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
});

Then('Verify order is present in the order history', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.ordersPage = this.pageObjectManager.getOrdersPage();
  expect(await this.ordersPage.orderIsPresent()).toBeTruthy();
});

// prettier-ignore
Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
    // Write code here that turns the phrase above into concrete actions
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await this.page.title());

    // create locator
    this.userName = this.page.locator('#username');
    this.signIn = this.page.locator('#signInBtn');
    this.cardTitles = this.page.locator('.card-body a');

    await this.userName.fill(username);
    await this.page.locator('[type="password"]').fill(password);
    await this.signIn.click();
});

Then('Verify error message is displayed', async function () {
  // Write code here that turns the phrase above into concrete actions
  console.log(await this.page.locator('[style*="block"]').textContent());
  // prettier-ignore
  await expect(this.page.locator('[style*="block"]')).toContainText('Incorrect');
});
