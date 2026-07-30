class LoginPage{
    constructor(page){
        this.page = page;
        this.BASE_URL = 'file://' + __dirname.replace(/\\/g, '/').replace('/pages', '') + '/mock-app';
    }

    async goto(){
        await this.page.goto(`${this.BASE_URL}/login.html`);
    }

    async fillUsername(username){
        await this.page.fill('#username', username);
    }

    async fillPassword(password){
        await this.page.fill('#password', password);
    }

    async clickLoginButton(){
        await this.page.click('button');
    }

    async login(username, password){

        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        await this.page.waitForURL(`**/dashboard.html`);
    }

    getWelcomeMessage() {
        return this.page.locator('.welcome');
    }

    getErrorMessage() {
        return this.page.locator('#error-message');
    }
}

module.exports = LoginPage;