class CheckoutPage {
  constructor(page, productName) {
    this.page = page;
    this.checkoutButton = page.locator('text=Checkout');
    this.notValidValueCard = page.locator('[value="4542 9931 9292 2293"]');
    this.placeholderCountry = page.locator('[placeholder="Select Country"]');
    this.countryResults = page.locator('.ta-results');
  }

  async productIsVisible(productName) {
    // locator built dynamically from argument
    const productTitleText = this.page.locator(`h3:has-text("${productName}")`);
    return await productTitleText.isVisible();
  }

  async submitOrder(countryNameText) {
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 60000 });
    await this.checkoutButton.click();
    await this.notValidValueCard.clear();
    await this.placeholderCountry.pressSequentially(countryNameText);
    const dropdown = await this.countryResults;
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
  }
}

module.exports = { CheckoutPage };
