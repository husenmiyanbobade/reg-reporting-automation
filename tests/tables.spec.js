//import { test, expect, describe, beforEach, afetrEach, beforAll, afterAll, chromium } from '@playwright/test';

const { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll, chromium } = require('@playwright/test');
const { type } = require('node:os');

const BASE_URL = 'file://' + __dirname.replace(/\\/g, '/') + '/../mock-app';

//Helper Function
async function searchReports(page , filters={}) {

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

//Helper function
async function getExpectedBadgeClass(status) {
    if (status == 'Submitted') return 'badge-submitted';
    if (status == 'Pending') return 'badge-pending';
    if (status === 'Rejected') return 'badge-rejected';
    
}


describe('Tables and Grids — Regulatory Reporting Portal', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await chromium.launch()
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/reports.html`);
    });

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Verify reports table has correct column headers', async () => {
        await searchReports(page);

        const headers = page.locator('table thead th');
        await expect(headers).toHaveCount(5);
        await expect(headers.nth(0)).toContainText('Report ID');
        await expect(headers.nth(1)).toContainText('Report Type');
        await expect(headers.nth(2)).toContainText('Filing Period');
        await expect(headers.nth(3)).toContainText('Submitted By');
        await expect(headers.nth(4)).toContainText('Status');
    });

    test('Search with no filters returns all 5 reports', async() =>{

        await searchReports(page);

        const rows = page.locator('table tbody tr');
        await expect(rows).toHaveCount(5);

    });

    test('Verify complete row data for RPT-001 report', async() => {

        await searchReports(page, {reportId : 'RPT-001'});

        //stote expected data as an object
        const expectedReport = {
            id: 'RPT-001',
            type: 'EMIR',
            period: 'Q1 2024',
            submittedBy: 'john.smith',
            status: 'Submitted'
        };

        //get first row
        const row = page.locator('table tbody tr').nth(0);

        //verify each cell against expected object
        await expect(row.locator('td').nth(0)).toContainText(expectedReport.id);
        await expect(row.locator('td').nth(1)).toContainText(expectedReport.type);
        await expect(row.locator('td').nth(2)).toContainText(expectedReport.period);
        await expect(row.locator('td').nth(3)).toContainText(expectedReport.submittedBy);
        await expect(row.locator('td').nth(4)).toContainText(expectedReport.status);

    });

    test('Find RPT-003 row by content and verify status is Rejected', async () => {
        await searchReports(page);

        // Find the row that contains RPT-003 — regardless of its position
        const targetRow = page.locator('table tbody tr').filter({ hasText: 'RPT-003' });

        // Verify it exists and has correct status
        await expect(targetRow).toBeVisible();
        await expect(targetRow).toContainText('CCAR');
        await expect(targetRow).toContainText('Rejected');
    });

    test('Empty table shows no results message when no reports match', async () => {
        await searchReports(page, { reportId: 'RPT-999' });

        // Table should have no rows
        await expect(page.locator('table tbody tr')).toHaveCount(0);

        // No results message should be visible
        await expect(page.getByText('No reports found matching your criteria.')).toBeVisible();
    });

    test('verify status badge colors match report status for all rows', async() => {
        await searchReports(page);

        const expectedStatuses = [
            {id  : 'RPT-001', status : 'Submitted'},
            {id  : 'RPT-002', status : 'Pending'},
            {id  : 'RPT-003', status : 'Rejected'},
            { id: 'RPT-004', status: 'Submitted' },
            { id: 'RPT-005', status: 'Pending' }
        ];

        for (const report of expectedStatuses){
            const badge = page.getByTestId(`status-${report.id}`);
            await expect(badge).toContainText(report.status);
            await expect(badge).toHaveClass(new RegExp(getExpectedBadgeClass(report.status)))
        }

    });

});

