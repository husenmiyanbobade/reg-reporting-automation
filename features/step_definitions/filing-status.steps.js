const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('the regulator will respond with {string}', async function (mockedStatus) {
  if (mockedStatus === 'ServerError') {
    await this.page.route('https://api.regulator-mock.com/filings/RPT-001/status', async (route) => {
      await route.fulfill({ status: 500 });
    });
  } else {
    await this.page.route('https://api.regulator-mock.com/filings/RPT-001/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: mockedStatus, message: `Filing ${mockedStatus.toLowerCase()} by regulator` }),
      });
    });
  }

  await this.page.goto('file:///D:/reg-reporting-automation/mock-app/filing-status.html');
});

When('I check the status', async function () {
  await this.page.getByTestId('check-status-btn').click();
});

Then('I should see the status {string}', async function (expectedStatus) {
  await expect(this.page.getByTestId('status-result')).toContainText(expectedStatus);
});