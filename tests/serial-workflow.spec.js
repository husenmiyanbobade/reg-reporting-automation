const { test, expect } = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe.serial('Filing submission then status check (order matters)', () => {
  let filingSubmitted = false;

  test('submits the filing to the regulator', async ({ page }) => {
    await page.route('**/filings/submit', async route => {
      filingSubmitted = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'RPT-001 submitted to regulator successfully' })
      });
    });

    await page.goto(`${BASE_URL}/filing-status.html`);
    await page.click('[data-testid="submit-filing-btn"]');

    const result = page.getByTestId('submit-result');
    await expect(result).toContainText('submitted to regulator successfully');
  });

  test('checks status reflects the earlier submission', async ({ page }) => {
    await page.route('**/filings/RPT-001/status', async route => {
      const status = filingSubmitted ? 'Accepted' : 'NotYetSubmitted';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status, message: filingSubmitted ? 'Filing validated successfully' : 'No submission on file' })
      });
    });

    await page.goto(`${BASE_URL}/filing-status.html`);
    await page.click('[data-testid="check-status-btn"]');

    const result = page.getByTestId('status-result');
    await expect(result).toContainText('Accepted');
  });
});