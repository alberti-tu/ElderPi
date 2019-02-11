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
    await connection.query( 'CREATE DATABASE ElderPi' );
    await connection.query( 'USE ElderPi' );
    await connection.query( 'CREATE TABLE users (id TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)' );
    await connection.query( 'USE ElderPi' );
    await connection.query( 'CREATE TABLE sensors (name TEXT, ip_address TEXT NOT NULL, id TEXT NOT NULL, date DATETIME NULL)' );
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
