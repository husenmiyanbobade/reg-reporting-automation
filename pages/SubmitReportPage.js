class SubmitReportPage {
    constructor(page) {
        this.page = page;
        this.BASE_URL = 'file://' + __dirname.replace(/\\/g, '/').replace('/pages', '') + '/mock-app';
    }

    async goto() {
        await this.page.goto(`${this.BASE_URL}/submit-report.html`);
    }

    async selectReportType(type) {
        await this.page.getByTestId('report-type-select').selectOption(type);
    }

    async selectJurisdictions(codes) {
        await this.page.getByTestId('jurisdiction-select').selectOption(codes);
    }

    async fillDates(fromDate, toDate) {
        await this.page.getByTestId('from-date-input').fill(fromDate);
        await this.page.getByTestId('to-date-input').fill(toDate);
    }

    async fillAmount(amount) {
        await this.page.getByTestId('amount-input').fill(String(amount));
    }

    async submitForReview() {
        await this.page.getByTestId('submit-review-btn').click();
    }

    async submitReport({ type, jurisdictions, fromDate, toDate, amount }) {
        await this.selectReportType(type);
        await this.selectJurisdictions(jurisdictions);
        await this.fillDates(fromDate, toDate);
        await this.fillAmount(amount);
        await this.submitForReview();
    }

    async getReportId() {
        return await this.page.getByTestId('report-id-display').inputValue();
    }

    getJurisdictionOption(code) {
        return this.page.getByTestId('jurisdiction-select').locator(`option[value="${code}"]`);
    }

    getSuccessMessage() {
        return this.page.getByTestId('success-message');
    }

    getErrorMessage() {
        return this.page.getByTestId('error-message');
    }
}

module.exports = SubmitReportPage;