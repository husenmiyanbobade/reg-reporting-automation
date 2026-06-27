const{test, expect, chromium, describe, beforeAll, afterAll, beforeEach, afterEach } = require('@playwright/test');

const BASE_URL = 'file://'+ __dirname.replace(/\\/g, '/') + '/../mock-app';

//Helper function - resusable search Report function
async function searchByReportId(page, reportId) {
    await page.getByTestId('report-id-input').fill(reportId);
    await page.getByRole('button', { name: 'Search' }).click();
}   

//Helper function - reusable navigation
async function goToReportsPage(page) {
    await page.goto(`${BASE_URL}/reports.html`);
}

//Helper Function - Reusable Search by Report Type

async function searchByReportType(page, type) {
    await page.getByLabel('Report Type').selectOption(type)
    await page.getByRole('button', {name : 'Search'}).click();       
}

describe('Search Reports — Regulatory Reporting Portal', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch();
        console.log('🚀 Browser launched once for all tests');
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await goToReportsPage(page);
        console.log('📄 New page opened and navigated to reports');
        console.log(test.info().title)
    });

    afterEach(async () => {
        await page.close();
        console.log('📝 Page closed after test');
    });

    afterAll(async () => {
        await browser.close();
        console.log('🔒 Browser closed after all tests');
    });

    test('Search by valid report ID returns one result', async () => {
        await searchByReportId(page, 'RPT-001');
        await expect(page.locator('table tbody tr')).toHaveCount(1);
        await expect(page.getByText('RPT-001')).toBeVisible();
    });

    test('search by invalid report ID returns no results', async () => {
        await searchByReportId(page, 'RPT-999');
        await expect(page.locator('table tbody tr')).toHaveCount(0);
        await expect(page.getByText('No reports found matching your criteria.')).toBeVisible();
    });

    test('Search by EMIR report type returns correct results', async () => {
        await page.getByLabel('Report Type').selectOption('EMIR');
        await page.getByRole('button', { name: 'Search' }).click();    
        await expect(page.locator('table tbody tr')).toHaveCount(2);
    });

    test('Search by report type returns correct results', async () => {
        await searchByReportType(page, 'CCAR')
        await page.getByRole('button', { name: 'Search' }).click();    
        await expect(page.locator('table tbody tr')).toHaveCount(1);
    });

    test('Search By Submitted status returns correct results', async () => {
        await page.getByLabel('Status').selectOption('Submitted');
        await page.getByRole('button', { name: 'Search' }).click();    
        await expect(page.locator('table tbody tr')).toHaveCount(2);
    });

});

describe('Login — Regulatory Reporting Portal', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch();  
        console.log('🚀 Browser launched once for all tests');
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/login.html`);
        console.log('📄 New page opened and navigated to login');
    });

    afterEach(async () => {
        await page.close();
        console.log('📝 Page closed after test');
    });

    afterAll(async () => {
        await browser.close();
        console.log('🔒 Browser closed after all tests');
    });

    test('Valid Login navigates to Dashboard', async () => {
        await page.fill('#username', 'reportadmin');
        await page.fill('#password', 'SecurePass123');
        await page.click('button');
        await expect(page.locator('.welcome')).toContainText('Welcome, Report Administrator');
    });

    test('Invalid Login shows error message', async () => {
        await page.fill('#username', 'wronguser');
        await page.fill('#password', 'wrongpass');
        await page.click('button');
        await expect(page.locator('#error-message')).toBeVisible();
    });
});

describe('Reset Functionality — Regulatory Reporting Portal', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch();
        console.log('🚀 Browser launched once for all tests');
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await goToReportsPage(page);
        console.log('📄 New page opened and navigated to reports');
    });

    afterEach(async () => {
        await page.close();
        console.log('📝 Page closed after test');
    });

    afterAll(async () => {
        await browser.close();
        console.log('🔒 Browser closed after all tests');
    });

    test('Reset button clears all search fields', async () => {
        await page.getByTestId('report-id-input').fill('RPT-001');
        await page.getByLabel('Report Type').selectOption('EMIR');
        await page.getByLabel('Status').selectOption('Submitted');
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(page.getByTestId('report-id-input')).toHaveValue('');
        await expect(page.getByLabel('Report Type')).toHaveValue('');
        await expect(page.getByLabel('Status')).toHaveValue('');
    });

     test('Search by EMIR report type returns correct results & Reset', async () => {
        await page.getByLabel('Report Type').selectOption('EMIR');
        await page.getByRole('button', { name: 'Search' }).click();    
        await expect(page.locator('table tbody tr')).toHaveCount(2);
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(page.getByTestId('report-id-input')).toHaveValue('');
        await expect(page.getByLabel('Report Type')).toHaveValue('');
        await expect(page.getByLabel('Status')).toHaveValue('');
     });
});