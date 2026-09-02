const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

class CustomWorld extends World {
    
    constructor(options) {
        super(options);
        this.browser = null;
        this.page = null;
    }

    async openBrowser() {
        this.browser = await chromium.launch({headless : false});
        const context = await this.browser.newContext();
        this.page = await context.newPage();
    }

    async closeBrowser(){
        await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);