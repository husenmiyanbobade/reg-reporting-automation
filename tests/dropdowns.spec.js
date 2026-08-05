const {test, expect, chromium}  = require('@playwright/test');
const ReportsPage = require('../pages/ReportsPage');

test('Select multiple juridictions in multi-select dropdown', async() => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const reportsPage = new ReportsPage(page);

    await reportsPage.goto();

    //Select multiple Juridiction options at once using an array
    await page.getByTestId('jurisdiction-select').selectOption(['EU','UK']);

    // Verify both are selected
    const selectedOptions = await page.getByTestId('jurisdiction-select').evaluate(select =>{
        return Array.from(select.selectedOptions).map(option => option.value);
    });

    console.log('Selected values:', selectedOptions);
    expect(selectedOptions).toEqual(['EU', 'UK']);
    await browser.close();
});

test('Fill date range fields correctly', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const reportsPage = new ReportsPage(page);

    await reportsPage.goto();

    // Native date inputs require YYYY-MM-DD format regardless of visual display
    await page.getByTestId('from-date-input').fill('2024-01-01');
    await page.getByTestId('to-date-input').fill('2024-03-31');

    // Verify the values were set correctly
    await expect(page.getByTestId('from-date-input')).toHaveValue('2024-01-01');
    await expect(page.getByTestId('to-date-input')).toHaveValue('2024-03-31');

    await browser.close();
});

test('Selecting CCAR report type disables non-US jurisdictions', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const reportsPage = new ReportsPage(page);

    await reportsPage.goto();

    // Select CCAR report type
    await reportsPage.selectReportType('CCAR');

    // US Jurisdiction should be enabled
    await expect(page.locator('#jurisdiction option[value="US"]')).toBeEnabled();

    // EU, UK, APAC should now be disabled
    await expect(page.locator('#jurisdiction option[value="EU"]')).toBeDisabled();
    await expect(page.locator('#jurisdiction option[value="UK"]')).toBeDisabled();
    await expect(page.locator('#jurisdiction option[value="APAC"]')).toBeDisabled();

    await browser.close();
});