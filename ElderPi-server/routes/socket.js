const mysql = require('../database/mysql');
const auth = require('./authentication');
let io = '';
let users = 0;

// Obtain the parameters of the socket
const getSocket = function getSocket(_io, _socket) {
    io = _io;
    // socket authentication middleware
    io.use((socket, next) => {
        let token = socket.handshake.query.authorization;
        if(auth.validateToken(token)) next();
        else console.error('This token is not valid');
    });

    users = users + 1;
    console.log('Connexions: ' + users);

    updateClient();

    _socket.on('disconnect', function () {
        users = users - 1;
        console.log('Connexions: ' + users);
    });
};

// Send the mysql sensor table through web socket
const updateClient = async function updateClient() {
    let result = await mysql.query('SELECT * FROM sensors ORDER BY timestamp DESC');
    if(users !== 0) io.emit('updateTable', result);
};

module.exports = {
    getSocket: getSocket,
    updateClient: updateClient
};
