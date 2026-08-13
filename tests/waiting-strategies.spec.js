const {test, expect} = require('@playwright/test');

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test.describe('Waiting strategies', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(`${BASE_URL}/async-loading.html`);
    });

    test('wait for pending count to appear in DOM', async ({page}) => {
        //This element does not exist in the DOM yet, so we need to wait for it to appear
        const countLocator = page.getByTestId('pending-count');

        await countLocator.waitFor({state : 'visible'});

        await expect(countLocator).toHaveText('7');
    });

    test('waits for filing status after button click', async ({page}) => {
        //await page.getByTestId('check-status-btn').click();
        await page.click('[data-testid="check-status-btn"]');

        //loading text appears while waiting for the filing status to be returned
        await expect(page.getByTestId('status-loading')).toBeVisible();

        //final status text appears after the filing status is returned
        const statusLocator = page.getByTestId('filing-status');
        await statusLocator.waitFor({state : 'visible'});

        await expect(statusLocator).toContainText('Filing accepted by regulator');
    });

    test('waits for toast to appear then disappear', async ({page}) => {
        await page.click('[data-testid="submit-correction-btn"]');
        
        const toast = page.getByTestId('toast-message');
        await expect(toast).toBeVisible();
        await expect(toast).toContainText('Correction submitted successfully');
        await toast.waitFor({state : 'hidden'});
        await expect(toast).toBeHidden();
    });

    test('waits for new row to be added after Load More Reports click', async ({page}) => {
        await expect(page.locator('#history-body tr')).toHaveCount(1);
        
        await page.click('[data-testid="load-more-btn"]');
        
        const newRow = page.getByTestId('row-rpt-006');
        await newRow.waitFor({state: 'attached'});

        await expect(page.locator('#history-body tr')).toHaveCount(2);
    });
});