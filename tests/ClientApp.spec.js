import { test, expect } from '@playwright/test';
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test.skip('registration page', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('.text-reset').click();

  await page.locator('.login-title').textContent();
  await expect(page.locator('.login-title')).toContainText('Register');

  await page.locator('#firstName').fill('Lena');
  await page.locator('#lastName').fill('brd');
  await page.locator('#userEmail').fill(email);
  await page.locator('#userMobile').fill('1123456789');
  await page.locator('#userPassword').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.locator('[type="checkbox"]').check();
  await page.locator('#login').click();
});

test('login and find the first product', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();

  await page.waitForLoadState('networkidle');
  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);
});

test('Add an item to the cart @Web', async ({ page }) => {
  // js file - Login js page object file, dashboard page
  const products = page.locator('.card-body');
  const productName = 'ZARA COAT 3';

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();
  await page.waitForLoadState('networkidle');
  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);

  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator('b').textContent()) === productName) {
      //add to cart
      await products.nth(i).locator('text= Add To Cart').click();
      break;
    }
  }
  await page.locator('[routerlink*="cart"]').click();
  // wait till will be loaded li's
  await page.waitForLoadState('networkidle');
  await page.locator('div li').first().waitFor();

  const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
  expect(bool).toBeTruthy();

  await page.locator('text=Checkout').click();

  await page.locator('[value="4542 9931 9292 2293"]').clear();
  await page.locator('[placeholder="Select Country"]').pressSequentially('ind');
  const dropdown = await page.locator('.ta-results');
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator('button').count();
  for (let i = 0; i < optionsCount; ++i) {
    let text = await dropdown.locator('button').nth(i).textContent();
    if (text === ' India') {
      // click on that option
      await dropdown.locator('button').nth(i).click();
      break;
    }
  }
  // prettier-ignore
  await expect(page.locator('.user__name [type="text"]').first()).toHaveText(email);
  await page.locator('.action__submit').click();
  // prettier-ignore
  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
  // prettier-ignore
  const orederId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
  console.log(orederId);

  await page.locator('button[routerlink*="myorders"]').click();
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
