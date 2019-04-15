const mysql = require('../database/mysql');
const auth = require('./authentication');

mysql.connect();    // Connects the Database or creates one if it doesn't exists

// Check a registered user
const login = async function login(req, res) {
    try {
        let result = await mysql.query('SELECT * FROM users WHERE username = ? AND password = ?',
            [req.body.username, req.body.password]);
        res.send({ token: auth.createToken(result[0].username) });  // correct login
    } catch (error) {
        res.send({ token: '' });    // wrong login
    }
};

const getEmail = async function getEmail(req, res) {
    let result = await mysql.query('SELECT * FROM notifications');
    res.send(result);
};

const addEmail = async function addEmail(req, res) {
    await mysql.query('INSERT INTO notifications VALUES (?)', [req.body.email]);
    res.end();
};

const deleteEmail = async function addEmail(req, res) {
    await mysql.query('DELETE FROM notifications WHERE email = ?', [req.body.email]);
    res.end();
};

module.exports = {
    login: login,
    getEmail: getEmail,
    addEmail: addEmail,
    deleteEmail: deleteEmail
};
