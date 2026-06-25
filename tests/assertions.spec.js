const {test, expect} = require('@playwright/test');

const BASE_URL = 'file://'+ __dirname.replace(/\\/g, '/') + '/../mock-app';

test('Search button is enable and Reset button is enabled', async ({browser}) => {

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeEnabled();

});

test('Report ID input field has correct placeholder text', async ({browser}) => {

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);   
    
    await expect(page.getByTestId('report-id-input')).toHaveAttribute('placeholder', 'e.g. RPT-001');

});

test('All fields are set to default after clicking Reset button', async ({browser}) => {

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);    
    
    //First fill the fields with some values
    await page.getByTestId('report-id-input').fill('RPT-001');
    await page.getByLabel('Report Type').selectOption('EMIR');
    await page.getByLabel('Status').selectOption('Submitted');

    //Click Reset button
    await page.getByRole('button', { name: 'Reset' }).click();

    //Check that all fields are set to default values
    await expect(page.getByTestId('report-id-input')).toBeEmpty();;
    await expect(page.getByLabel('Report Type')).toHaveValue('');
    await expect(page.getByLabel('Status')).toHaveValue('');
});

test('All Results show EMIR when filtered by EMIR Report Type', async ({browser}) => {
    
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByLabel('Report Type').selectOption('EMIR');
    await page.getByRole('button', { name: 'Search' }).click();

    //Get all rows in the results table
    const rows = await page.locator('table tbody tr');
    const rowCount = await rows.count();

    //Check that all rows have EMIR in the Report Type column

    for (let i = 0; i < rowCount; i++) {
        await expect(rows.nth(i)).toContainText('EMIR');
    }

});   
    
test('verify All details of RPT-001 report using soft assertions', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByTestId('report-id-input').fill('RPT-001');
    await page.getByRole('button', { name: 'Search' }).click();

    //soft assertions - all runs even if one fails
    await expect.soft(page.locator('table tbody tr')).toHaveCount(1);
    await expect.soft(page.getByText('RPT-001')).toBeVisible();  
    await expect.soft(page.getByRole('cell', { name: 'EMIR' })).toBeVisible();
    await expect.soft(page.getByText('Q1 2024')).toBeVisible();
    await expect.soft(page.getByText('john.smith')).toBeVisible();
    await expect.soft(page.getByTestId('status-RPT-001')).toContainText('Submitted');
});