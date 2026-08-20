const { test, expect } = require('../fixtures/report-fixtures');
const ReportsPage = require('../pages/ReportsPage');

test.describe('Using the Custom Fixture', () => {

  test('search reports as already-logged-in user', async ({ loggedInPage }) => {
    // No login code here at all — the fixture already did it
    await loggedInPage.goto(`file://${__dirname.replace(/\\/g, '/')}/../mock-app/reports.html`);
    await expect(loggedInPage).toHaveURL(/reports\.html/);
  });

  test('Search for report and assert a result', async ({ reportsPage }) => {
    const reports = new ReportsPage(reportsPage);
    await reports.search({ reportId: 'RPT-001' });

    const result = reports.getRowByContent('RPT-001');
    await expect(result).toContainText('Submitted');
  });

});