class ReportsPage {
    constructor(page){
        this.page = page;
         this.BASE_URL = 'file://' + __dirname.replace(/\\/g, '/').replace('/pages', '') + '/mock-app';
    }

    async goto(){
        await this.page.goto(`${this.BASE_URL}/reports.html`);
    }

    async fillReportId(reportId) {
        await this.page.getByTestId('report-id-input').fill(reportId);
    }

    async selectReportType(type) {
        await this.page.getByLabel('Report Type').selectOption(type);
    }

    async selectStatus(status) {
        await this.page.getByLabel('Status').selectOption(status);
    }

    async clickSearch() {
        await this.page.getByRole('button', { name: 'Search' }).click();
    }

    async clickReset() {
        await this.page.getByRole('button', { name: 'Reset' }).click();
    }

    async search(filters = {}) {
        if (filters.reportId) {
            await this.fillReportId(filters.reportId);
        }
        if (filters.reportType) {
            await this.selectReportType(filters.reportType);
        }
        if (filters.status) {
            await this.selectStatus(filters.status);
        }
        await this.clickSearch();
    }

    getRows() {
        return this.page.locator('table tbody tr');
    }

    getRowByContent(text) {
        return this.getRows().filter({ hasText: text });
    }

    async getRowCount() {
        return await this.getRows().count();
    }

    getNoResultsMessage() {
        return this.page.getByText('No reports found matching your criteria.');
    }

    getReportTypeDropdown() {
        return this.page.getByLabel('Report Type');
    }
}

module.exports = ReportsPage;

