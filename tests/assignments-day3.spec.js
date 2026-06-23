// Day 3 Assignments - Actions, Keyboard, Reset, JS Variables
// Branch: day3-actions-practice

const {test, expect} = require('@playwright/test');

const BASE_URL = 'file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/';

const searchId = 'RPT-001';
const wrongSearchId = 'RPT-999';
test('select reportId from dropdown', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByLabel('Report Type').selectOption('Basel III');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('RPT-004')).toBeVisible();
});

test('Enter invalid report ID and clear field', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByTestId('report-id-input').fill(wrongSearchId);
    await page.getByRole('button' , { name: 'Search'}).click();
    await expect(page.getByText('No reports found matching your criteria.')).toBeVisible();

    await page.getByTestId('report-id-input').clear();
    await page.getByTestId('report-id-input').fill(searchId);
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(searchId)).toBeVisible();
});

test('Search EMIR reports with Pending status returns exactly one result', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByLabel('Report Type').selectOption('EMIR');
    await page.getByLabel('Status').selectOption('Pending');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.getByText('RPT-005')).toBeVisible();
});

test('Enter reportID press tab and press Enter then search',async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByTestId('report-id-input').fill('RPT-003');
    await page.getByTestId('report-id-input').press('Tab');
    await page.getByTestId('report-type-select').press('Enter');
    await expect(page.getByText('RPT-003')).toBeVisible();
});

test('Reset button behavior',async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    await page.getByLabel('Report Type').selectOption('MiFID');
    await page.getByLabel('Status').selectOption('Pending');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.getByLabel('Report Type')).toHaveValue('');
    await expect(page.locator('table tbody tr')).toHaveCount(0);
});

test ('Search report using ENTER key after filling report ID', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);
    await page.getByTestId('report-id-input').fill(searchId);
    await page.getByTestId('report-id-input').press('Enter');
    await expect(page.getByText(searchId)).toBeVisible();
});

test ('Clear field and refill with new Report ID', async ({browser}) => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/reports.html`);

    const reportIDField = page.getByTestId('report-id-input');
    await reportIDField.fill(searchId);
    await reportIDField.clear(); // Clear the field
    await reportIDField.fill(searchId)

    await page.getByRole('button', { name: 'Search' }).click(); 

    await expect(page.getByText(searchId)).toBeVisible();
});