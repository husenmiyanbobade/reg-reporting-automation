const { Before, After } = require('@cucumber/cucumber');

Before(async function () {
    await this.openBrowser();
});

After(async function () {
    await this.closeBrowser();
});

Before({ tags: '@dashboard' }, async function () {
  console.log('Running dashboard-specific setup...');
});