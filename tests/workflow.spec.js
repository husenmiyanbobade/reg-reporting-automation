const { test, expect } = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe('Workflow Actions - New Tab, Dialogs, Iframe', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/workflow.html`);
  });

  test('opens report details in a new tab', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('[data-testid="open-details-btn"]')
    ]);

    await newPage.waitForLoadState();
    await expect(newPage.getByTestId('detail-page-heading')).toContainText('RPT-001');
  });

  test('opens report details in a new tab and closes it and then check Approve Report button on original page', async ({ page, context }) => {

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('[data-testid="open-details-btn"]')
    ]);

    await newPage.waitForLoadState();
    await expect(newPage.getByTestId('detail-page-heading')).toContainText('RPT-001');

    await newPage.close();
    await expect(page.getByTestId('approve-btn')).toBeVisible();

  });

  test('approves report via confirm dialog', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('approve report RPT-001');
      await dialog.accept();
    });

    await page.click('[data-testid="approve-btn"]');

    await expect(page.getByTestId('approval-status')).toContainText('approved');
  });

   test('dismisses approval confirm dialog and keeps approval status hidden', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('approve report RPT-001');
      await dialog.dismiss();
    });

    await page.click('[data-testid="approve-btn"]');

    await expect(page.getByTestId('approval-status')).not.toBeVisible();
  });

   test('rejects report via prompt dialog with reason', async ({ page }) => {
    page.on('dialog', async dialog => {
      await dialog.accept('Incomplete counterparty data');
    });

    await page.click('[data-testid="reject-btn"]');

    await expect(page.getByTestId('approval-status')).toContainText('Incomplete counterparty data');
  });

  test('validates LEI code inside iframe', async ({ page }) => {
    const frame = page.frameLocator('[data-testid="lei-widget"]');

    await frame.locator('#lei-input').fill('12345678901234567890'); // 20 chars
    await frame.locator('#validate-btn').click();

    await expect(frame.locator('#lei-result')).toContainText('Valid LEI format');
  });

  test('shows error for invalid LEI code inside iframe', async ({ page }) => {
    const frame =page.frameLocator('[data-testid="lei-widget"]');
    await frame.locator('#lei-input').fill('1234567890123456789'); // 19 chars
    await frame.locator('#validate-btn').click();
    await expect(frame.locator('#lei-result')).toContainText('Invalid LEI - must be 20 characters');
  });

});