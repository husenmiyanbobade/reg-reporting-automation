const { test, expect } = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe('Mapping Process - Request & Response Verification', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/mapping-process.html`);
    });

    test('sends correct parameters in the outgoing mapping request', async ({ page }) => {
        let capturedBody;
        await page.route('**/api.mapping-mock.com/execute', async route => {
            capturedBody = route.request().postDataJSON();
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ mappingId: 'MAP-001' })
            });
        });

        await page.getByTestId('model-name-select').selectOption('BERT-Base');
        await page.getByTestId('dependency-version-input').fill('3.1.0');
        await page.getByTestId('environment-select').selectOption('QA');

        await page.getByTestId('run-mapping-btn').click();

        await page.getByTestId('run-mapping-btn').waitFor({ state: 'visible' });

        // Confirm the request that actually went out matches what the user selected
        expect(capturedBody.model).toBe('BERT-Base');
        expect(capturedBody.dependencyVersion).toBe('3.1.0');
        expect(capturedBody.environment).toBe('QA');

    });

    test('shows success message and mapping ID when mapping succeeds', async ({ page }) => {
        await page.route('**/api.mapping-mock.com/execute', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ mappingId: 'MAP-4521' })
            });
        });

        await page.getByTestId('run-mapping-btn').click();

        const result = page.getByTestId('mapping-result');
        await expect(result).toContainText('Mapping completed');
        await expect(result).toContainText('MAP-4521');
    });

    test('shows conflict message when mapping already exists', async ({ page }) => {
        await page.route('**/api.mapping-mock.com/execute', async route => {
            await route.fulfill({
                status: 409,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'A mapping for this model/version already exists' })
            });
        });

        await page.getByTestId('run-mapping-btn').click();

        const result = page.getByTestId('mapping-result');
        await expect(result).toContainText('Conflict');
        await expect(result).toContainText('already exists');
    });

    test('shows validation error when dependency version is invalid', async ({ page }) => {
        await page.route('**/api.mapping-mock.com/execute', async route => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Invalid dependency version format' })
            });
        });

        await page.getByTestId('dependency-version-input').fill('not-a-version');
        await page.getByTestId('run-mapping-btn').click();

        const result = page.getByTestId('mapping-result');
        await expect(result).toContainText('Invalid dependency version format');
    });

    test('shows error in case of network failure', async ({ page }) => {
        await page.route('**/api.mapping-mock.com/execute', async route => {
            await route.abort('failed');
        });

        await page.getByTestId('run-mapping-btn').click();

        const result = page.getByTestId('mapping-result');
        await expect(result).toContainText('Could not reach mapping system');
    });

    test('mapping page visual baseline', async ({ page }) => {
        await expect(page).toHaveScreenshot('mapping-page.png');
    });

});