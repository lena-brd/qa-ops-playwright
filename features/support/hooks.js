const { PageObjectManager } = require('../../pageobjects/PageObjectManager.js');
const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status,
} = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

Before(async function () {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  this.page = await context.newPage();
  this.pageObjectManager = new PageObjectManager(this.page);
});

BeforeStep(function () {
  // for screenshots
});

AfterStep(async function ({ result }) {
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: 'screenshot-cucumber.png' });
  }
});

After(function () {
  // Assuming this.driver is a selenium webdriver
  console.log('I am last to execute');
});
