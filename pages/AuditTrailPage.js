class AuditTrailPage {
    constructor(page) {
        this.page = page;
        this.BASE_URL = 'file://' + __dirname.replace(/\\/g, '/').replace('/pages', '') + '/mock-app';
    }

    async goto(reportId) {
        const query = reportId ? `?reportId=${reportId}` : '';
        await this.page.goto(`${this.BASE_URL}/audit-trail.html${query}`);
    }

    async filterBy(reportId) {
        await this.page.getByTestId('report-filter-input').fill(reportId);
    }

    getRows(reportId) {
        return this.page.getByTestId(`audit-row-${reportId}`);
    }

    // Returns action text for each row, in the order shown (newest first)
    async getActions(reportId) {
        return await this.getRows(reportId).locator('td:nth-child(2)').allTextContents();
    }

    getNoHistoryMessage() {
        return this.page.getByTestId('no-history');
    }
}

module.exports = AuditTrailPage;