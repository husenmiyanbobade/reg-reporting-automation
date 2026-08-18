const { test, expect } = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app/`;

test.describe('API + UI Combined Verification', () => {

    test('UI-displayed report title matches the actual API data', async ({ page, request }) => {

        const reportId = 3;

        // Step 1: Get the "ground truth" directly from the API
        const apiResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${reportId}`);
        expect(apiResponse.ok()).toBeTruthy();

        const apiData = await apiResponse.json();

        //Step 2: Fetch the same report through the UI
        await page.goto(`${BASE_URL}/report-lookup.html`);
        await page.getByTestId('report-id-input').fill(String(reportId));
        await page.getByTestId('fetch-report-btn').click();

        const reportTitleLocator = page.getByTestId('report-title');
        await reportTitleLocator.waitFor({ state: 'visible' });

        // Step 3: Cross-check — does the UI show exactly what the API says?
        await expect(reportTitleLocator).toHaveText(apiData.title);
        await expect(page.getByTestId('report-body')).toHaveText(apiData.body);

    });

    test('UI shows a proper error when report ID does not exist', async ({ page, request }) => {
        const invalidId = 99999;

        // Confirm via API first that this ID genuinely doesn't exist
        const apiResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${invalidId}`);
        expect(apiResponse.status()).toBe(404);

        // Now confirm the UI handles that same case gracefully
        await page.goto(`${BASE_URL}/report-lookup.html`);
        await page.getByTestId('report-id-input').fill(String(invalidId));
        await page.getByTestId('fetch-report-btn').click();

        const errorLocator = page.getByTestId('report-error');
        await errorLocator.waitFor({ state: 'visible' });
        await expect(errorLocator).toContainText('not found');
    })

    test('UI-displayed report title matches the actual API data for Report 7', async ({ page, request }) => {

        const reportId = 7;

        // Step 1: Get the "ground truth" directly from the API
        const apiResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${reportId}`);
        expect(apiResponse.ok()).toBeTruthy();

        const apiData = await apiResponse.json();

        //Step 2: Fetch the same report through the UI
        await page.goto(`${BASE_URL}/report-lookup.html`);
        await page.getByTestId('report-id-input').fill(String(reportId));
        await page.getByTestId('fetch-report-btn').click();

        const reportTitleLocator = page.getByTestId('report-title');
        await reportTitleLocator.waitFor({ state: 'visible' });

        // Step 3: Cross-check — does the UI show exactly what the API says?
        await expect(reportTitleLocator).toHaveText(apiData.title);
        //await expect(reportTitleLocator).toHaveText('Report 7 populated'); ---invalid case on purpose
        await expect(page.getByTestId('report-body')).toHaveText(apiData.body);

    });


});