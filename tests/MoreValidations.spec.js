import { test, expect } from '@playwright/test';

test('Popup validations', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  //   await page.goto('https://www.google.com/');
  // await page.goBack();
  // await page.goForward();
  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();

  // page.on -> ON METHID WILL HELP U TO LISTEN TO EVENTS, WHEN EVENTS OCCUR
  // dialog => dialog.accept will click ok button
  // dialog => dialog.dismiss will click cancel button
  page.on('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmbtn').click();

  //how to hover over buttob
  await page.locator('#mousehover').hover();
});

test('Screenshot & Visual comparision', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  // to capture screenshot on locator level
  await page
    .locator('#displayed-text')
    .screenshot({ path: 'partialScreenshot.png' });
  await page.locator('#hide-textbox').click();
  // to capture screenshot on page level
  await page.screenshot({ path: 'screenshot.png' });
  await expect(page.locator('#displayed-text')).toBeHidden();
});

// screenshot (yesterday) => store screenshot (today) to compare
// this is isual testing
test.skip('visual', async ({ page }) => {
  await page.goto('https://flightaware.com/');
  // on first time will fail bevause it did not have this landing.png screenshot
  expect(await page.screenshot()).toMatchSnapshot('landing.png');
});
