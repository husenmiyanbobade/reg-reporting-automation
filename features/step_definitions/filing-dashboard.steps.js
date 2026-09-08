const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('the following reports exist:', async function (dataTable) {
  this.expectedReports = dataTable.hashes();
});

When('I view the filing dashboard', async function () {
  await this.page.goto('file:///D:/reg-reporting-automation/mock-app/filing-dashboard.html');
});

Then('all reports should show their correct status', async function () {
  for (const report of this.expectedReports) {
    await expect(this.page.getByTestId(`status-${report.reportId}`)).toHaveText(report.status);
  }
});