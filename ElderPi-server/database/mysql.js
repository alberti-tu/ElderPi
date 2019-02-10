const mariadb = require('mariadb');
const pool = mariadb.createPool({ user:'root', host: 'localhost', database: 'ElderPi'});

const connectDatabase = async function connectDatabase() {
    pool.getConnection()
        .then(connection => {
            console.log('Database connected');
        })
        .catch(err => {
            let temp = mariadb.createPool({ user:'root', host: 'localhost' });
            temp.query('CREATE DATABASE ElderPi');
            temp.query('USE ElderPi');
            temp.query('CREATE TABLE users (id TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)');
            temp.query('USE ElderPi');
            temp.query('CREATE TABLE sensors (name TEXT, ip_address TEXT NOT NULL, id TEXT NOT NULL, date DATETIME NULL );');
            console.log('Database created');
        });
};

const querySQL = async function querySQL(sql, params = null) {
    return pool.query(sql, params);
};

module.exports = {
    connectDatabase: connectDatabase,
    querySQL: querySQL
};
