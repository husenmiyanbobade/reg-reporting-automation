const { test, expect } = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe('Network Interception - Filing Status', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/filing-status.html`);
  });

  test('shows accepted status when API returns success', async ({ page }) => {
    await page.route('**/filings/RPT-001/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'Accepted', message: 'Filing validated successfully' })
      });
    });

    await page.click('[data-testid="check-status-btn"]');

    const result = page.getByTestId('status-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Accepted');
    await expect(result).toContainText('Filing validated successfully');
  });

  test('shows rejected status when API returns rejection', async ({ page }) => {
    await page.route('**/filings/RPT-001/status', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'Rejected', message: 'Missing counterparty LEI code' })
      });
    });

    await page.click('[data-testid="check-status-btn"]');

    const result = page.getByTestId('status-result');
    await expect(result).toContainText('Rejected');
    await expect(result).toContainText('Missing counterparty LEI code');
  });

  test('shows error message when API returns server error', async ({ page }) => {
    await page.route('**/filings/RPT-001/status', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });

    await page.click('[data-testid="check-status-btn"]');

    const result = page.getByTestId('status-result');
    await expect(result).toContainText('Error checking status');
    await expect(result).toContainText('500');
  });

  test('shows fallback message when network completely fails', async ({ page }) => {
    await page.route('**/filings/RPT-001/status', async route => {
      await route.abort('failed');
    });

    await page.click('[data-testid="check-status-btn"]');

    const result = page.getByTestId('status-result');
    await expect(result).toContainText('Could not reach regulator system');
  });

  test('submits filing successfully and sends correct request body', async ({ page }) => {
    let capturedBody;

    await page.route('**/filings/submit', async route => {
      capturedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'RPT-001 submitted to regulator successfully' })
      });
    });

    await page.click('[data-testid="submit-filing-btn"]');

    const result = page.getByTestId('submit-result');
    await expect(result).toContainText('submitted to regulator successfully');

    expect(capturedBody.reportId).toBe('RPT-001');
  });

    test('submits filing fails and shows error message when API returns error', async ({ page }) => {
        await page.route('**/filings/submit', async route => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Invalid report data' })
            });
        });

        await page.click('[data-testid="submit-filing-btn"]');
        const result = page.getByTestId('submit-result');
        await expect(result).toContainText('Invalid report data');
    });
});    

    test.describe('Network Interception - Filing Status (delayed response)', () => {
      test('shows loading text while API is delayed and then displays final result', async ({ page }) => {
        // Route the status API and delay the response by 2 seconds before fulfilling.
        await page.route('**/filings/RPT-001/status', async route => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ status: 'Accepted', message: 'Filing validated successfully' })
          });
        });

        // Trigger the status check in the app UI.
        await page.click('[data-testid="check-status-btn"]');

        // While the request is delayed, the UI should show a loading message.
        const loading = page.getByText('Checking with regulator...');
        await expect(loading).toBeVisible();

        // After the delayed response completes, the final result should appear.
        const result = page.getByTestId('status-result');
        await expect(result).toContainText('Accepted');
        await expect(result).toContainText('Filing validated successfully');

        // The loading text should no longer be visible once the final result is shown.
        await expect(loading).not.toBeVisible();
      });
});

