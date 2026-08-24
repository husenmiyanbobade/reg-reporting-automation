const {test, expect} = require(`@playwright/test`);
const {sql, getConnection} = require('../db/database');

test.describe('Database Connection', () => {

    test('connect to sqlserver and reads seeded data', async () =>{

        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM FilingStatus;') 

        console.log(result.recordset);

        expect(result.recordset.length).toBeGreaterThan(0);
        expect(result.recordset[0].ReportId).toBe('RPT-001');

        await pool.close();
    });

});