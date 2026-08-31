const {test, expect} = require('../fixtures/db-fixtures');

test.describe('Database setup and Teardown', () => {

    test('seeded report exists during the test and matches expected values', async({ seededReport }) => {

        const { pool, reportId } = seededReport;

        const result = await pool.request()
            .input('id', reportId)
            .query('SELECT * FROM FilingStatus WHERE ReportId = @id');

        console.log(result.recordset);    

        expect(result.recordset.length).toBe(1);
        expect(result.recordset[0].ReportType).toBe('MiFID');
        
        expect(result.recordset[0].Status).toBe('Pending');

        // Deliberately wrong, to force a failure
        //expect(result.recordset[0].Status).toBe('THIS_WILL_FAIL');

    });

});