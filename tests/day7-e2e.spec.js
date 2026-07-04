const {test, expect, describe, beforeAll, afterAll, beforeEach, afterEach, chromium} = require ('@playwright/test');
const { type } = require('node:os');
const BASE_URL = 'file://' + __dirname.replace(/\\/g, '/') + '/../mock-app';

async function login(page, username, password) {
    await page.goto(`${BASE_URL}/login.html`);
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button');
    await page.waitForURL('**/dashboard.html');
}

async function searchReports(page, filters = {}) {
    await page.goto(`${BASE_URL}/reports.html`);
    if (filters.reportId) {
        await page.getByTestId('report-id-input').fill(filters.reportId);
    }
    if (filters.reportType) {
        await page.getByLabel('Report Type').selectOption(filters.reportType);
    }
    if (filters.status) {
        await page.getByLabel('Status').selectOption(filters.status);
    }
    await page.getByRole('button', { name: 'Search' }).click();
}

describe('End-to-End Regulatory Reporting portal workflow', () =>{

    let browser;
    let page;

    beforeAll(async () =>{
        browser = await chromium.launch();
    })

    beforeEach(async ()=> {
        page = await browser.newPage();

    });
    
    afterEach(async () => {
        await page.close();
    });

    afterAll(async () =>{
        await browser.close();
    });

    test('Complete workflow: login, search, verify, reset, search again, verify details', async () => {
        //step 1 : Login 
        await login(page, 'reportadmin', 'SecurePass123');
        await expect(page.locator('.welcome')).toContainText('Welcome, Report Administrator');

        //Step 2 : Search by Report type
        await searchReports(page, {reportType :'EMIR'});
        await expect(page.locator('table tbody tr')).toHaveCount(2);

        //Step 3 : Verify Table data using object
        const expectedFirstReport = {
            reportId : 'RPT-001',
            type : 'EMIR',
            status : 'Submitted'
        };

        const firstRow = page.locator('table tbody tr').filter({ hasText : expectedFirstReport.reportId});
        await expect(firstRow).toContainText(expectedFirstReport.type);
        await expect(firstRow).toContainText(expectedFirstReport.status);

        //Step 4 : Reset the search filters
        await page.getByRole('button', { name: 'Reset'}).click();
        await expect(page.getByLabel('Report Type')).toHaveValue('');
        await expect(page.locator('table tbody tr')).toHaveCount(0);

        //Step 5 : Search again by Status
        await page.getByLabel('status').selectOption('Pending');
        await page.getByRole('button', {name : 'Search'}).click();
        await expect(page.locator('table tbody tr')).toHaveCount(2);

        //verify specific reports details using array and loops
        const expectedPendingReports =[
            {id : 'RPT-002' , type : 'MiFID'},
            {id : 'RPT-005', type :'EMIR'}

        ];

        for (const report of expectedPendingReports) {
            const row = page.locator('table tbody tr').filter({hasText : report.id});
            await expect(row).toContainText(report.type);
            await expect(row).toContainText('Pending');
        }

    });

});