// Libraries
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

// Certificates
const fs = require('fs');
const options = { key: fs.readFileSync('certificate/server.key'), cert: fs.readFileSync('certificate/server.cert') };

// Express inicialization
const express = require('express');
const app = express();

// Server inicialization
const http = require('http').createServer(app).listen(80);
const https = require('https').createServer(options, app).listen(443);
const io = require('socket.io').listen(https, { path: '/sensor/io'});

// Configurations
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Function routes
const auth = require('./routes/authentication');
const user = require('./routes/user');
const sensor = require('./routes/sensor');
const socketIO = require('./routes/socket');
const network = require('./network/network');

// Redirect the traffic HTTP to HTTPS and keep the traffic HTTP of the WSN
network.interfaces('wlan0');
app.use(function(req, res, next) {
    let ip_remote = req.connection.remoteAddress.split('::ffff:')[1];  // sensor's IPv4 address

    if (req.secure || (network.isFromLan(ip_remote) && req.method === 'POST' && req.url === '/sensor' )) next();
    else res.redirect('https://' + req.headers.host + req.url);
});

// Backend routes
app.post('/login', user.login);

app.post('/sensor', sensor.updateSensor, sensor.insertSensor, sensor.updateHistory);
app.put('/sensor', auth.getToken, sensor.updateNameDevice);
app.get('/sensor/history', auth.getToken, sensor.getHistory);

// Socket events
io.on('connection', (socket) => { socketIO.getSocket(io, socket) });

// Frontend routes
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg'];
app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) res.sendFile(path.resolve('public/' + req.url));
    else res.sendFile(path.resolve('public/index.html'));
});
