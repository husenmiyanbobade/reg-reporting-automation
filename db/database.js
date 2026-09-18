const sql = require('mssql');


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