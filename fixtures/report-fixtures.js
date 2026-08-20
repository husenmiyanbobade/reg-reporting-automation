const base = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

exports.test = base.test.extend({
  loggedInPage: async ({ page }, use, testInfo) => {
    // SETUP — runs before the test
    const loginPage = new LoginPage(page);
    await loginPage.goto(); 
    await loginPage.login('reportadmin', 'SecurePass123');

    // Hand control to the test
    await use(page);

    // TEARDOWN — runs after the test, even if it fails
    console.log(`Test finished: ${testInfo.title}`);
  },

  reportsPage: async ({ loggedInPage }, use) => {
    // No login code here — just reuse the already-logged-in page
    await loggedInPage.goto(`file://${__dirname.replace(/\\/g, '/')}/../mock-app/reports.html`);

    await use(loggedInPage);

  },
});

exports.expect = base.expect;