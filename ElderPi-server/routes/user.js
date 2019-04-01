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


module.exports = {
    login: login
};
