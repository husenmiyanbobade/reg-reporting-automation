const sql = require('mssql');

//console.log('DEBUG - DB_SERVER seen by Playwright worker:', JSON.stringify(process.env.DB_SERVER));
//console.log('DEBUG - DB_PORT seen by Playwright worker:', JSON.stringify(process.env.DB_PORT));


const config = {

    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function getConnection() {

    return await sql.connect(config);
    
}

module.exports = {sql, getConnection} ;