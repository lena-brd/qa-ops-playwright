// const { test } = require('@playwright/test');
import { test, expect } from '@playwright/test';
require('dotenv').config();

const email = process.env.EMAIL_PAGE_PRACTISE;
const password = process.env.PASSWORD_PAGE_PRACTISE;

// global fixture -> browser
// {browser} playwright fixture
test.skip('Browser Context Playwright test', async ({ browser }) => {
  // create a context
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  console.log(await page.title());

  // create locator
  const userName = page.locator('#username');
  const signIn = page.locator('#signInBtn');
  const cardTitles = page.locator('.card-body a');

  await userName.fill(email);
  await page.locator('[type="password"]').fill('default');
  await signIn.click();
  await page.waitForLoadState('networkidle');

  // extract the text that is present on error message
  // playwright will wait until this element will show up (it also can depend on timeout that is configured)
  // console.log(await page.locator('[style*="block"]').textContent());
  // prettier-ignore
  await expect(page.locator('[style*="block"]')).toContainText('Incorrect');

  await userName.fill('rahulshettyacademy');
  await signIn.click();
  await page.waitForLoadState('networkidle');
  // console.log(await cardTitles.first().textContent());
  await expect(await cardTitles.first()).toContainText('iphone X');
  // or u can use the nth
  console.log(await cardTitles.nth(1).textContent());
  await expect(await cardTitles.nth(1)).toContainText('Samsung Note 8');

  // how to grab the text title of all products
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test.skip('Page Playwright test', async ({ page }) => {
  await page.goto('https://google.com');
  // get title - assertion
  console.log(await page.title());
  await expect(page).toHaveTitle('Google');
});

test('UI Controls', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const userName = page.locator('#username');
  const signIn = page.locator('#signInBtn');
  const dropdown = page.locator('select.form-control');
  const documentLink = page.locator('[href*="documents-request"]');
  // consult is the value option
  // dropdown
  await dropdown.selectOption('consult');
  // await page.pause();

  // radio button
  await page.locator('.radiotextsty').last().click();
  await page.locator('#okayBtn').click();
  // assertion for checkbox
  // isChecked() will print true or false
  console.log(await page.locator('.radiotextsty').last().isChecked());
  await expect(page.locator('.radiotextsty').last()).toBeChecked();

  // checkmark
  await page.locator('#terms').check();
  await expect(page.locator('#terms')).toBeChecked();
  await page.locator('#terms').uncheck();
  // console.log(await page.locator('#terms').isChecked());
  expect(await page.locator('#terms').isChecked()).toBeFalsy();
  await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});

test('Child windows handling', async ({ browser }) => {
  // this test is when u will click on a button and will open a new window
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator('#username');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const documentLink = page.locator('[href*="documents-request"]');
  // before clicking u have to tell playwright that wait for a new window page
  // thats why we need {browser}

  // u need to switch to a new page context
  // waitForEvent -> wait for a new page to open in a background
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // listen for any new page to open
    // u need to switch to a new page context
    documentLink.click(),
  ]); // new page is opened
  const text = await newPage.locator('.red').textContent();
  const arrayText = text.split('@');
  const domain = arrayText[1].split(' ')[0];
  console.log(text);
  console.log(domain);

  await userName.fill(domain);
  console.log(await page.locator('#username').inputValue());
});
