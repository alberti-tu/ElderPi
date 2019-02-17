const mariadb = require('mariadb');
let connection;

// Connects the Database or creates one if it doesn't exists
const connect = async function connect() {
    try {
        connection = await mariadb.createConnection({ user:'root', host: 'localhost', database: 'ElderPi' });
        connection = await connection.end();
        console.log('Database connected');
    } catch {
        createDatabase();
    }
};

async function createDatabase() {
    // Creates a new Database
    connection = await mariadb.createConnection({ user:'root', host: 'localhost' });
    await connection.query('CREATE DATABASE ElderPi');
    await connection.query('USE ElderPi');
    await connection.query('CREATE TABLE users (username VARCHAR(64) NOT NULL, password VARCHAR(64) NOT NULL, UNIQUE KEY unique_user (username))');
    await connection.query('USE ElderPi');
    await connection.query('CREATE TABLE sensors (deviceID VARCHAR(24) NOT NULL, ip_address VARCHAR(15) NOT NULL, timestamp DATETIME, UNIQUE KEY unique_user (deviceID))');
    await connection.query('USE ElderPi');
    await connection.query('INSERT INTO users VALUES (?, ?)', ['admin', 'admin']);
    connection = await connection.end();
    console.log('Database created');

    // Test the connection with the Database
    connection = await mariadb.createConnection({ user:'root', host: 'localhost', database: 'ElderPi' });
    connection = await connection.end();
    console.log('Database connected');
}

// Generic SQL query
const querySQL = async function querySQL(sql, params = null) {
    connection = await mariadb.createConnection({ user:'root', host: 'localhost', database: 'ElderPi' });
    let result = await connection.query(sql, params);
    connection = await connection.end();
    return result;
};

module.exports = {
    connect: connect,
    querySQL: querySQL
};
