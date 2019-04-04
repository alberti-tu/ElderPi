const mysql = require('../database/mysql');
const auth = require('./authentication');
let io = '';

// Obtain the parameters of the socket
const getSocket = function getSocket(_io, _socket) {
    io = _io;

    // socket authentication middleware
    io.use((socket, next) => {
        let token = socket.handshake.query.authorization;
        if(auth.validateToken(token)) next();
        else console.error('This token is not valid');
    });

    // Send the sensor table
    _socket.on('getTable', () => {
        updateClient()
    });
};

// Send the mysql sensor table through web socket
const updateClient = async function updateClient() {
    try {
        let result = await mysql.query('SELECT * FROM sensors ORDER BY timestamp DESC');
        io.emit('updateTable', result);
    }
    catch (error) { }   // There're not users connected
};

const sendAdvice = async function sendAdvice(sensor) {
    try {
        io.emit('sensorTimeout', sensor);
    }
    catch (error) { }   // There're not users connected
};

module.exports = {
    getSocket: getSocket,
    updateClient: updateClient,
    sendAdvice: sendAdvice
};
