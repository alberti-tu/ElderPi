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
                res.send(rows);
                return next();
            }
            mysql.querySQL('INSERT INTO sensors VALUES (?,?,?,NOW())', [req.body.deviceID, req.body.precense, req.body.battery])
                .then(rows => {
                    res.send(rows);
                    return next();
                })
                .catch(error => res.send(error.code));
        } )
        .catch(error => res.send(error.code) );
};

// Send the mysql sensor table through web socket
const updateClient = function updateClient() {
    mysql.querySQL('SELECT * FROM sensors')
        .then(rows => io.emit('updateTable', rows))
        .catch(error => console.error(error.code));
};

module.exports = {
    getSocket: getSocket,
    updateSensor: updateSensor,
    updateClient: updateClient
};
