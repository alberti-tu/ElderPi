// Libraries
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Configuration
const config = require('./config');

// Certificates
try {
    fs.statSync(config.https.options.key).isFile();
    fs.statSync(config.https.options.cert).isFile();
}
catch {
    console.log('SSL certificates can not be founded!\nFrom the ElderPi-server root directory, execute: ');
    console.log('\topenssl req -nodes -new -x509 -keyout ' + config.https.options.key + ' -out ' + config.https.options.cert + ' -days 365');
    process.exit();
}
const options = { key: fs.readFileSync(config.https.options.key), cert: fs.readFileSync(config.https.options.cert) };

// Express inicialization
const express = require('express');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

// Server inicialization
const http = require('http').createServer(app).listen(config.http.port);
const https = require('https').createServer(options, app).listen(config.https.port);
const io = require('socket.io').listen(https, { path: '/sensor/io'});

// Function routes
const auth = require('./routes/authentication');
const user = require('./routes/user');
const sensor = require('./routes/sensor');
const socketIO = require('./routes/socket');
const network = require('./network/network');

// Redirect the traffic HTTP to HTTPS and keep the traffic HTTP of the WSN
network.interfaces(config.wsn.interface);
app.use(function(req, res, next) {
    let ip_remote = req.connection.remoteAddress.split('::ffff:')[1];  // sensor's IPv4 address

    if (req.secure || (network.isFromLan(ip_remote) && req.method === 'POST')) next();
    else res.redirect('https://' + req.headers.host + req.url);
});

// Backend routes
app.post('/login', user.login);
app.get('/user/email', auth.getToken, user.getEmail);
app.post('/user/email', auth.getToken, user.addEmail);
app.put('/user/email', auth.getToken, user.deleteEmail);

app.post('/sensor', sensor.updateSensor, sensor.insertSensor, sensor.updateHistory);
app.put('/sensor', auth.getToken, sensor.updateDevice);
app.post('/sensor/alert', sensor.lowBattery);
app.get('/sensor/history', auth.getToken, sensor.getHistory);

// Socket events
io.on('connection', (socket) => { socketIO.getSocket(io, socket) });

// Frontend routes
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg'];
app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) res.sendFile(path.resolve('public/' + req.url));
    else res.sendFile(path.resolve('public/index.html'));
});
