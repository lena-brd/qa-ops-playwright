class OrdersPage {
  constructor(page) {
    this.page = page;
    this.myOrdersButton = page.locator('button[routerlink*="myorders"]');
    this.rowsDetails = page.locator('tbody tr');
    this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
    this.orderIdDetails = page.locator('.col-text');
  }

  async orderIsPresent() {
    const orderIdNumber = await this.orderId.textContent();
    await this.myOrdersButton.click();
    await this.page.locator('tbody').waitFor();

    // const orderIdNumber = await this.orderId.textContent();

    const rows = await this.page.locator('tbody tr');

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator('th').textContent();
      if (orderIdNumber.includes(rowOrderId)) {
        await rows.nth(i).locator('button').first().click();
        break;
      }
    }
    const orderIdDetailsText = await this.orderIdDetails.textContent();
    return orderIdNumber.includes(orderIdDetailsText);
  }
}

module.exports = { OrdersPage };
