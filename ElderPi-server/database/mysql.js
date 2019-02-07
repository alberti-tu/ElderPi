const mariadb = require('mariadb');

const connect = function connect(database) {
    mariadb.createConnection( { user:'root', host: 'localhost' } ).then(conn => {
        console.log('Database connected! Id ' + conn.threadId);
    }).catch(err => {
        console.error('Mysql ' + err);
    });
};

const close = function close(database) {

};

module.exports = {
    connect: connect,
    close: close
};
