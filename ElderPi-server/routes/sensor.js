const mysql = require('../database/mysql');

// Update the sensor data or inserts a new one
const sensorStatus = async function sensorStatus(req, res) {
    let ip_address = req.connection.remoteAddress.split('::ffff:')[1];  // sensor's IPv4 address
    if(ip_address == null) ip_address = 'localhost';

    mysql.querySQL('UPDATE sensors SET ip_address = ?, precense = ?, battery = ?, timestamp = NOW() WHERE deviceID = ?', [ip_address, req.body.precense, req.body.battery, req.body.deviceID])
        .then(rows => {
            if(rows.affectedRows !== 0) return res.send(rows);
            mysql.querySQL('INSERT INTO sensors VALUES (?,?,?,?,NOW())', [req.body.deviceID, ip_address, req.body.precense, req.body.battery])
                .then(rows => res.send(rows))
                .catch(error => res.send(error.code));
        } )
        .catch(error => res.send(error.code) );
};

const selectAll = async function selectAll(req, res) {
    mysql.querySQL('SELECT * FROM sensors')
        .then(rows => res.send(rows))
        .catch(error => res.send(error.code));
};

module.exports = {
    selectAll: selectAll,
    sensorStatus: sensorStatus
};
