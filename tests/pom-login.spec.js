const {test, expect, chromium} = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');

test('Login using Page object model', async() => {

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('reportadmin', 'SecurePass123');

    await expect(loginPage.getWelcomeMessage()).toContainText('Welcome, Report Administrator');
    await browser.close();
});

