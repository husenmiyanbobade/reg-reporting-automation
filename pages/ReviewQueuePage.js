class ReviewQueuePage {
    constructor(page) {
        this.page = page;
        this.BASE_URL = 'file://' + __dirname.replace(/\\/g, '/').replace('/pages', '') + '/mock-app';
    }

    async goto() {
        await this.page.goto(`${this.BASE_URL}/review-queue.html`);
    }

    getRow(reportId) {
        return this.page.getByTestId(`review-row-${reportId}`);
    }

    getApproveButton(reportId) {
        return this.page.getByTestId(`approve-btn-${reportId}`);
    }

    getRejectButton(reportId) {
        return this.page.getByTestId(`reject-btn-${reportId}`);
    }

    // The title tooltip sits on the div wrapping both buttons
    getActionsWrapper(reportId) {
        return this.getApproveButton(reportId).locator('xpath=..');
    }

    getReasonInput(reportId) {
        return this.page.getByTestId(`reason-input-${reportId}`);
    }

    async approve(reportId) {
        await this.getApproveButton(reportId).click();
    }

    async startReject(reportId) {
        await this.getRejectButton(reportId).click();
    }

    async confirmReject(reportId) {
        await this.page.getByTestId(`confirm-reject-btn-${reportId}`).click();
    }

    async reject(reportId, reason) {
        await this.startReject(reportId);
        await this.getReasonInput(reportId).fill(reason);
        await this.confirmReject(reportId);
    }

    getNoPendingMessage() {
        return this.page.getByTestId('no-pending');
    }
}

module.exports = ReviewQueuePage;