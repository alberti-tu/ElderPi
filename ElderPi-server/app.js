const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const user = require('./routes/user');
const sensor = require('./routes/sensor');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Backend routes
app.get('/register/:username/:password', user.register);
app.get('/login/:username/:password', user.login);

app.get('/sensor/:deviceId', sensor.data);

// Frontend routes
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg'];
app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve('public/' + req.url));

    } else {
        res.sendFile(path.resolve('public/index.html'));
    }
});

module.exports = app;
