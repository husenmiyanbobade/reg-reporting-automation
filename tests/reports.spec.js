const {test , expect} = require('@playwright/test');

test('search reports using getByRole to find button', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/reports.html');

    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByTestId('reports-table')).toBeVisible();
});

test('Filter by Report Type using getBylable', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/reports.html');

    await page.getByLabel('Report Type').selectOption('EMIR');
    await page.getByRole('button', { name: 'Search' }).click();
   
    await expect(page.locator('table tbody tr')).toHaveCount(2);
});

test('Fill Report ID using getByTestId', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/reports.html');

    await page.getByTestId('report-id-input').fill('RPT-001');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('RPT-001')).toBeVisible();
});
