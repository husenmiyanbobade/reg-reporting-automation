const ReportsPage = require('../pages/ReportsPage');

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const SubmitReportPage = require('../pages/SubmitReportPage');
const ReviewQueuePage = require('../pages/ReviewQueuePage');
const AuditTrailPage = require('../pages/AuditTrailPage');

const MAKER = { username: 'maker1', password: 'MakerPass123' };
const CHECKER = { username: 'checker1', password: 'CheckerPass123' };

const validReport = {
    type: 'EMIR',
    jurisdictions: ['EU'],
    fromDate: '2026-09-01',
    toDate: '2026-09-30',
    amount: 10000
};

async function loginAs(page, user) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
}

// Logs in as the maker, submits a valid report, returns the generated report ID
async function makerSubmitsReport(page) {
    await loginAs(page, MAKER);
    const submitPage = new SubmitReportPage(page);
    await submitPage.goto();
    const reportId = await submitPage.getReportId();
    await submitPage.submitReport(validReport);
    await expect(submitPage.getSuccessMessage()).toBeVisible();
    return reportId;
}

test.describe('Maker-checker approval workflow', () => {

    test('maker submits, checker approves, audit trail records both steps', async ({ page }) => {
        const reportId = await makerSubmitsReport(page);

        await loginAs(page, CHECKER);
        const queue = new ReviewQueuePage(page);
        await queue.goto();
        await expect(queue.getRow(reportId)).toBeVisible();
        await expect(queue.getApproveButton(reportId)).toBeEnabled();

        await queue.approve(reportId);
        await expect(queue.getRow(reportId)).toHaveCount(0);
        await expect(queue.getNoPendingMessage()).toBeVisible();

        const audit = new AuditTrailPage(page);
        await audit.goto(reportId);
        // newest first
        expect(await audit.getActions(reportId)).toEqual(['Approved', 'Submitted for Review']);
    });

    test('maker cannot approve or reject their own submission', async ({ page }) => {
        const reportId = await makerSubmitsReport(page);

        // still logged in as the maker, go straight to the queue
        const queue = new ReviewQueuePage(page);
        await queue.goto();
        await expect(queue.getRow(reportId)).toBeVisible();
        await expect(queue.getApproveButton(reportId)).toBeDisabled();
        await expect(queue.getRejectButton(reportId)).toBeDisabled();
        await expect(queue.getActionsWrapper(reportId))
            .toHaveAttribute('title', 'You cannot approve your own submission');
    });

    test('rejection without a reason is blocked and the report stays in the queue', async ({ page }) => {
        const reportId = await makerSubmitsReport(page);
        await loginAs(page, CHECKER);

        const queue = new ReviewQueuePage(page);
        await queue.goto();

        let dialogMessage = '';
        page.once('dialog', async dialog => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });

        await queue.startReject(reportId);
        await queue.confirmReject(reportId);

        expect(dialogMessage).toBe('A rejection reason is required.');
        await expect(queue.getRow(reportId)).toBeVisible();
    });

    test('checker rejects with a reason and the reason lands in the audit trail', async ({ page }) => {
        const reportId = await makerSubmitsReport(page);
        await loginAs(page, CHECKER);

        const queue = new ReviewQueuePage(page);
        await queue.goto();
        await queue.reject(reportId, 'Amount does not match filing');
        await expect(queue.getRow(reportId)).toHaveCount(0);

        const audit = new AuditTrailPage(page);
        await audit.goto(reportId);
        expect(await audit.getActions(reportId)).toEqual([
            'Rejected: Amount does not match filing',
            'Submitted for Review'
        ]);
    });

    test('submit form blocks an empty submission and stores nothing', async ({ page }) => {
        await loginAs(page, MAKER);
        const submitPage = new SubmitReportPage(page);
        await submitPage.goto();
        await submitPage.submitForReview();

        await expect(submitPage.getErrorMessage()).toContainText('Report type is required.');
        await expect(submitPage.getErrorMessage()).toContainText('Select at least one jurisdiction.');
        await expect(submitPage.getErrorMessage()).toContainText('Amount must be greater than zero.');
        await expect(submitPage.getSuccessMessage()).toBeHidden();

        const stored = await page.evaluate(() => localStorage.getItem('pendingReports'));
        expect(stored).toBeNull();
    });

    test('submit form rejects a To date earlier than the From date', async ({ page }) => {
        await loginAs(page, MAKER);
        const submitPage = new SubmitReportPage(page);
        await submitPage.goto();
        await submitPage.submitReport({ ...validReport, fromDate: '2026-09-30', toDate: '2026-09-01' });

        await expect(submitPage.getErrorMessage()).toContainText('To date cannot be before From date.');
        await expect(submitPage.getSuccessMessage()).toBeHidden();
    });

    test('jurisdiction list narrows to match the selected report type', async ({ page }) => {
        await loginAs(page, MAKER);
        const submitPage = new SubmitReportPage(page);
        await submitPage.goto();
        await submitPage.selectReportType('EMIR');

        await expect(submitPage.getJurisdictionOption('EU')).toBeEnabled();
        await expect(submitPage.getJurisdictionOption('UK')).toBeEnabled();
        await expect(submitPage.getJurisdictionOption('US')).toBeDisabled();
        await expect(submitPage.getJurisdictionOption('APAC')).toBeDisabled();
    });

    test('clicking a status badge on the reports page opens that report\'s audit trail', async ({ page }) => {
        await page.goto(`file://${__dirname.replace(/\\/g, '/')}/../mock-app/reports.html`);
        const reports = new ReportsPage(page);
        await reports.search({ reportId: 'RPT-001' });

        const badge = page.getByTestId('status-RPT-001');
        await expect(badge).toHaveAttribute('title', 'Click to view audit trail for RPT-001');
        await badge.click();

        await expect(page).toHaveURL(/audit-trail\.html\?reportId=RPT-001$/);
        await expect(page.getByTestId('report-filter-input')).toHaveValue('RPT-001');
    });
});