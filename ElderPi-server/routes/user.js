const mysql = require('../database/mysql');

mysql.connect();    // Connects the Database or creates one if it doesn't exists

// Add a new user into the database
const register = async function register(req, res) {
    mysql.querySQL('INSERT INTO users VALUES (?, ?)', [req.params.username, req.params.password])
        .then(rows => res.send(rows) )
        .catch(error => res.send(error.code) );
};

// Check a registered user
const login = async function login(req, res) {
    mysql.querySQL('SELECT * FROM users WHERE username = ? AND password = ?',[req.body.username, req.body.password])
        .then(rows => res.send(rows.length.toString()) )
        .catch(error => res.send(error.code) );
};

module.exports = {
    register: register,
    login: login
};
