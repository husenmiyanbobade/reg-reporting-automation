const {test, expect} = require('@playwright/test');
const {BASE_URL , TEST_USERNAME, TEST_PASSWORD, ENV_NAME} = require('../config/environment');

test.describe('Environment configuration', ()=> {

    test('logs in using credentials from the active environment', async ({page}) => {
        console.log(`Running against Environment : ${ENV_NAME}`);
        console.log(`Using username : ${TEST_USERNAME}`);

        await page.goto(`${BASE_URL}/login.html`);
        await page.fill('#username', TEST_USERNAME);
        await page.fill('#password', TEST_PASSWORD);

       //await page.click('button:has-text("Login")');
        await page.getByRole('button', {name : 'Login'}).click();

        await expect(page).toHaveURL(/dashboard\.html/);

    });


});