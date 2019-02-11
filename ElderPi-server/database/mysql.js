const mariadb = require('mariadb');
let connection;

const connect = async function connect() {
    connection = mariadb.createConnection({ user:'root', host: 'localhost', database: 'ElderPi' })
        .then( result => { console.log('Database connected') } )
        .catch(err => { createDatabase() });
};

async function createDatabase() {
    connection = await mariadb.createConnection({ user:'root', host: 'localhost' });
    await connection.query( 'CREATE DATABASE ElderPi' );
    await connection.query( 'USE ElderPi' );
    await connection.query( 'CREATE TABLE users (id TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)' );
    await connection.query( 'USE ElderPi' );
    await connection.query( 'CREATE TABLE sensors (name TEXT, ip_address TEXT NOT NULL, id TEXT NOT NULL, date DATETIME NULL)' );
    connection = await connection.end();
    console.log('Database created');
}

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
