const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = { key: fs.readFileSync('certificate/server.key'), cert: fs.readFileSync('certificate/server.cert') };

const network = require('./network/network');
network.interfaces('wlan0');

const user = require('./routes/user');
const sensor = require('./routes/sensor');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Redirect the traffic HTTP to HTTPS
// Keep the traffic HTTP of the WSN
app.use(function(req, res, next) {
    let ip_remote = req.connection.remoteAddress.split('::ffff:')[1];  // sensor's IPv4 address
    if (req.secure || network.isFromLan(ip_remote)) next();
    else res.redirect('https://' + req.headers.host + req.url);
});

// Backend routes
app.get('/register/:username/:password', user.register);
app.post('/login', user.login);

app.get('/sensor', sensor.selectAll);
app.post('/sensor', sensor.sensorStatus);

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
