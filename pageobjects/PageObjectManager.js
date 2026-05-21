const { LoginPage } = require('../pageobjects/LoginPage.js');
const { DashboardPage } = require('../pageobjects/DashboardPage.js');
const { CheckoutPage } = require('../pageobjects/CheckoutPage.js');
const { OrdersPage } = require('../pageobjects/OrdersPage.js');

class PageObjectManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
    this.ordersPage = new OrdersPage(this.page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getDashboardPage() {
    return this.dashboardPage;
  }

  getCheckoutPage() {
    return this.checkoutPage;
  }

  getOrdersPage() {
    return this.ordersPage;
  }
}

module.exports = { PageObjectManager };
