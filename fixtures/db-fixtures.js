const base = require('@playwright/test');
const { sql, getConnection } = require('../db/database');

exports.test = base.test.extend({

    seededReport: async ({ }, use) => {
        const pool = await getConnection();

        const testReportId = 'RPT-TEST-001';

        // SETUP — insert known test data before the test runs

        await pool.request()
            .input('reportId', sql.VarChar, testReportId)
            .input('reportType', sql.VarChar, 'MiFID')
            .input('status', sql.VarChar, 'Pending')
            .input('submittedBy', sql.VarChar, 'test.automation')
            .query(`
            INSERT INTO FilingStatus (ReportId, ReportType, Status, SubmittedBy)
            VALUES (@reportId, @reportType, @status, @submittedBy)
        `);

        // Hand control to the test, along with useful info
        await use({ pool, reportId: testReportId });

        // TEARDOWN — always runs, even if the test fails
        await pool.request()
            .input('reportId', sql.VarChar, testReportId)
            .query('DELETE FROM FilingStatus WHERE ReportId = @reportId');

        await pool.close();
    },

});

exports.expect = base.expect;