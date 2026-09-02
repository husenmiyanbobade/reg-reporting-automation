const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the filing status page', async function () {
    await this.page.route('https://api.regulator-mock.com/filings/RPT-001/status', async(route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: 'Accepted', message: 'Filing accepted by regulator' }),
        });
    });

    await this.page.goto('file:///D:/reg-reporting-automation/mock-app/filing-status.html');
});

When('I check the status', async function () {
  await this.page.getByTestId('check-status-btn').click();
});

Then('I should see the status {string}', async function(expectedStatus){
    await expect(this.page.getByTestId('status-result')).toContainText(expectedStatus);
});