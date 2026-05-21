class LoginPage {
  constructor(page) {
    // locators better to add to cinstructor
    this.page = page;
    this.signInButton = page.locator('#login');
    this.userEmail = page.locator('#userEmail');
    this.password = page.locator('#userPassword');
    this.loadState = page.waitForLoadState('networkidle');
  }

  async goToLoginPage() {
    await this.page.goto('https://rahulshettyacademy.com/client');
  }

  async validLogin(email, password) {
    await this.userEmail.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
    await this.loadState;
  }
}

module.exports = { LoginPage };
