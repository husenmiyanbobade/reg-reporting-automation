const { test, expect } = require('@playwright/test');

const BASE_URL = 'file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/';

test ('Select Report type and Status from dropdowns', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByLabel('Report Type').selectOption('EMIR');
    await page.getByLabel('Status').selectOption('Submitted');

    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('table tbody tr')).toHaveCount(1);

});

test ('Search report using Keyboard Enter key', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByTestId('report-id-input').fill('RPT-002');
    await page.getByTestId('report-id-input').press('Enter');

    await expect(page.getByText('RPT-002')).toBeVisible();
});

test ('Clear field and refill with new Report ID', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    const reportIDField = page.getByTestId('report-id-input');
    await reportIDField.fill('RPT-001');
    await reportIDField.clear(); // Clear the field
    await reportIDField.fill('RPT-003');

    await page.getByRole('button', { name: 'Search' }).click(); 

    await expect(page.getByText('RPT-003')).toBeVisible();
});

test('Hover over status badge to reveal audit tooltip', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByTestId('report-id-input').fill('RPT-001');
    await page.getByRole('button', { name: 'Search' }).click();

    await page.getByTestId('status-RPT-001').hover();
    
    await expect(page.getByTestId('status-RPT-001')).toBeVisible();
});
