const mysql = require('../database/mysql');
const auth = require('./authentication');
let io = '';

// Obtain the parameters of the socket
const getSocket = function getSocket(_io) {
    io = _io;
    // socket authentication middleware
    io.use((socket, next) => {
        let token = socket.handshake.query.authorization;
        if(auth.validateToken(token)) next();
        else console.error('This token is not valid');
    });
    updateClient();
};

// Update the sensor data or inserts a new row
const updateSensor = function updateSensor(req, res, next) {
    mysql.querySQL('UPDATE sensors SET precense = ?, battery = ?, timestamp = NOW() WHERE deviceID = ?', [req.body.precense, req.body.battery, req.body.deviceID])
        .then(rows => {
            if(rows.affectedRows !== 0) {
                //insertHistory(req.body.deviceID);
                mysql.querySQL('SELECT * FROM sensors WHERE deviceID = ?', [req.body.deviceID])
                    .then(rows => {
                        mysql.querySQL('INSERT INTO history VALUES (?,?,?,?)', [rows[0].deviceName, rows[0].deviceID, rows[0].precense, rows[0].timestamp])
                            .then(rows => {
                                res.send(rows);
                                return next();
                            })
                            .catch(error => { console.log(error); res.code(500) });
                    } )
                    .catch(error => { console.log(error); res.code(500) });
            }
            mysql.querySQL('INSERT INTO sensors VALUES (NULL,?,?,?,NOW())', [req.body.deviceID, req.body.precense, req.body.battery])
                .then(rows => {
                    //insertHistory(req.body.deviceID);
                    mysql.querySQL('SELECT * FROM sensors WHERE deviceID = ?', [req.body.deviceID])
                        .then(rows => {
                            mysql.querySQL('INSERT INTO history VALUES (?,?,?,?)', [rows[0].deviceName, rows[0].deviceID, rows[0].precense, rows[0].timestamp])
                                .then(rows => {
                                    res.send(rows);
                                    return next();
                                })
                                .catch(error => { console.log(error); res.code(500) });
                        } )
                        .catch(error => { console.log(error); res.code(500) });
                })
                .catch(error => { console.log(error); res.code(500) });
        })
        .catch(error => { console.log(error); res.code(500) });
};

// Set a custom name for the device
const updateNameDevice = function updateNameDevice(req, res, next) {
    mysql.querySQL('UPDATE sensors SET deviceName = ? WHERE deviceID = ?', [req.body.deviceName, req.body.deviceID])
        .then(rows => {
            res.send(rows);
            return next();
        })
        .catch(error => { console.log(error); res.code(500) });
};

const insertHistory = function insertHistory(deviceID) {
    mysql.querySQL('SELECT * FROM sensors WHERE deviceID = ?', [deviceID])
        .then(rows => {
            mysql.querySQL('INSERT INTO history VALUES (?,?,?,?)', [rows[0].deviceName, rows[0].deviceID, rows[0].precense, rows[0].timestamp])
                .catch(error => { console.log(error); res.code(500) });
        } )
        .catch(error => { console.log(error); res.code(500) });
};

const sensorHistory = function sensorHistory(req, res) {
    mysql.querySQL('SELECT * FROM history ORDER BY timestamp DESC')
        .then(rows => res.send(rows) )
        .catch(error => { console.log(error); res.code(500) });
};

// Send the mysql sensor table through web socket
const updateClient = function updateClient() {
    mysql.querySQL('SELECT * FROM sensors ORDER BY timestamp DESC')
        .then(rows => io.emit('updateTable', rows))
        .catch(error => { console.log(error); res.code(500) });
};

module.exports = {
    getSocket: getSocket,
    sensorHistory: sensorHistory,
    updateSensor: updateSensor,
    updateNameDevice: updateNameDevice,
    updateClient: updateClient
};
