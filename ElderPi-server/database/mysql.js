const mariadb = require('mariadb');
const config = require('../config');
let connection;

// Connects the Database or creates one if it doesn't exists
const connect = async function connect() {
    try {
        connection = await mariadb.createConnection(config.mariaDB);
        connection = await connection.end();
        console.log('Database connected');
    } catch {
        createDatabase();
    }
};

async function createDatabase() {
    // Creates a new Database
    connection = await mariadb.createConnection({ user:config.mariaDB.user, host: config.mariaDB.host });
    await connection.query('CREATE DATABASE ' + config.mariaDB.database);

    await connection.query('USE ' + config.mariaDB.database);
    await connection.query('CREATE TABLE users (username VARCHAR(64) NOT NULL, password VARCHAR(64) NOT NULL, UNIQUE KEY unique_user (username))');

    await connection.query('USE ' + config.mariaDB.database);
    await connection.query('CREATE TABLE notifications (email VARCHAR(128) NOT NULL, UNIQUE KEY unique_address (email))');

    await connection.query('USE ' + config.mariaDB.database);
    await connection.query('CREATE TABLE sensors (deviceName VARCHAR(24) DEFAULT NULL, deviceID VARCHAR(24) NOT NULL, battery INT NOT NULL, expiration INT NOT NULL, timestamp DATETIME, UNIQUE KEY unique_sensor (deviceID))');

    await connection.query('USE ' + config.mariaDB.database);
    await connection.query('CREATE TABLE history (deviceName VARCHAR(24) DEFAULT NULL, deviceID VARCHAR(24) NOT NULL, duration INT NOT NULL, timestamp DATETIME)');

    await connection.query('USE ' + config.mariaDB.database);
    await connection.query('INSERT INTO users VALUES (?, ?)', ['admin', 'admin']);
    connection = await connection.end();
    console.log('Database created');

    // Test the connection with the Database
    connection = await mariadb.createConnection(config.mariaDB);
    connection = await connection.end();
    console.log('Database connected');
}

const query = async function query(sql, params = null) {
    async function querrySQL(sql, params) {
        connection = await mariadb.createConnection(config.mariaDB);
        let result = await connection.query(sql, params);
        connection = await connection.end();

        return result;
    }

    return await new Promise(resolve => {
        resolve( querrySQL(sql, params) );
    } );
};

module.exports = {
    connect: connect,
    query: query
};
