const {test, expect, chromium} = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ReportsPage = require('../pages/ReportsPage');

test('E2E workflow using Page Object Model', async () => {
    const browser= await chromium.launch();
    const page = await browser.newPage();

    const loginPage = new LoginPage(page);
    const reportsPage = new ReportsPage(page);

    // Step 1 go to login page
    await loginPage.goto();
    await loginPage.login('reportadmin', 'SecurePass123');
    await expect(loginPage.getWelcomeMessage()).toContainText('Welcome, Report Administrator');

    // Search by report type
    await reportsPage.goto();
    await reportsPage.search({reportType : 'EMIR'});
    expect(await reportsPage.getRowCount()).toBe(2);

     // Verify a specific row
     const row = reportsPage.getRowByContent('RPT-001');
     await expect(row).toContainText('Submitted');

     // Reset and verify empty
    await reportsPage.clickReset();
    await expect(reportsPage.getReportTypeDropdown()).toHaveValue('');
    expect(await reportsPage.getRowCount()).toBe(0);
    
    // Search again by status
    await reportsPage.search({status : 'Pending'});
    expect(await reportsPage.getRowCount()).toBe(2);

    await browser.close();


});