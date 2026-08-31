const { test, expect } = require('../fixtures/db-fixtures');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe('DB-Backed UI Validation', () => {

  test('UI report view matches the actual seeded database row', async ({ page, seededReport }) => {
    const { pool, reportId } = seededReport;

    // Step 1: Get the "ground truth" directly from the database
    const dbResult = await pool.request()
      .input('id', reportId)
      .query('SELECT * FROM FilingStatus WHERE ReportId = @id');

    const dbRow = dbResult.recordset[0];
    expect(dbRow).toBeTruthy();

    // Step 2: Build the URL the way a real backend would redirect to, using the real DB values
    const url = `${BASE_URL}/db-report-view.html?reportId=${dbRow.ReportId}&reportType=${dbRow.ReportType}&status=${dbRow.Status}&submittedBy=${dbRow.SubmittedBy}`;
    await page.goto(url);

    // Step 3: Cross-check — does the UI show exactly what the database says?
    await expect(page.getByTestId('db-report-id')).toHaveText(dbRow.ReportId);
    await expect(page.getByTestId('db-report-type')).toHaveText(dbRow.ReportType);
    await expect(page.getByTestId('db-report-status')).toHaveText(dbRow.Status);
    await expect(page.getByTestId('db-report-submitted-by')).toHaveText(dbRow.SubmittedBy);
  });

});