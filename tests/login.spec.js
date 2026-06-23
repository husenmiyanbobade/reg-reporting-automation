const { test, expect } = require('@playwright/test');

test('Login to Regulatory Reporting Portal with valid credentials', async ({ browser }) => {
    // Launch browser and open login page
    const page = await browser.newPage();
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/login.html');
    
    // Fill in the login form
    await page.fill('#username', 'reportadmin');
    await page.fill('#password', 'SecurePass123');
    
    // Click login button
    await page.click('button');
    
    // Wait for success message and verify it appears
    await expect(page.locator('#success-message')).toContainText('Login successful');
    
    // Wait for redirect to dashboard and verify we're on the right page
    await page.waitForURL('**/dashboard.html');
    await expect(page.locator('.welcome')).toContainText('Welcome, Report Administrator');
});

test('Login to Regulatory Reporting portal with invalid credentials', async ({ browser}) => {
    //Launch browser and open login page
    const page = await browser.newPage();
    await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/../mock-app/login.html');

    // Fill in the login form with invalid credentials
    await page.fill('#username', 'WrongUser');
    await page.fill('#password', 'WrongPass');

    // Click login button
    await page.click('button');

    // Verify the error message is now visible and contains expected text
    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#error-message')).toContainText('Invalid credentials');
});
