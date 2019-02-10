const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mysql = require('./database/mysql');

mysql.connectDatabase();

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Backend routes

//
//'INSERT INTO users (name) VALUES ("' + req.params.name + '")'

// Insert new User and return all database (TEST)
app.get('/send/:id/:username/:password', function (req, res) {
    mysql.querySQL('INSERT INTO users VALUES (?,?,?)', [req.params.id, req.params.username, req.params.password])
        .then(() => {
            mysql.querySQL('SELECT * FROM users').then(rows => { res.send( rows ) });
        })
        .catch(error => {
            console.error(error);
            res.send(error);
        });
});


// Frontend
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg'];
app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve('public/' + req.url));

    } else {
        res.sendFile(path.resolve('public/index.html'));
    }
});

module.exports = app;
