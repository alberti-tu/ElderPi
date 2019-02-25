const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = { key: fs.readFileSync('certificate/server.key'), cert: fs.readFileSync('certificate/server.cert') };

const user = require('./routes/user');
const sensor = require('./routes/sensor');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Redirect the traffic HTTP to HTTPS
app.use(function(req, res, next) {
    if (req.secure) next();
    else res.redirect('https://' + req.headers.host + req.url);
});

// Backend routes
app.get('/register/:username/:password', user.register);
app.post('/login', user.login);

app.get('/sensor', sensor.selectAll);
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

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

/*
    To generate the certificate:
        openssl req -nodes -new -x509 -keyout server.key -out server.cert
 */
