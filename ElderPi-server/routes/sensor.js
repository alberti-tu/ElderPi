const mysql = require('../database/mysql');

// Update the sensor data or inserts a new one
const data = async function data(req, res) {
    let ip_address = req.connection.remoteAddress.split('::ffff:')[1];  // sensor's IPv4 address
    mysql.querySQL('UPDATE sensors SET ip_address = ?, timestamp = NOW() WHERE deviceID = ?', [ip_address, req.params.deviceId])
        .then(rows => {
            if(rows.affectedRows !== 0) return res.send(rows);
            mysql.querySQL('INSERT INTO sensors VALUES (?,?,NOW())', [req.params.deviceId, ip_address])
                .then(rows => res.send(rows) )
                .catch(error => res.send(error.code) );
        } )
        .catch(error => res.send(error.code) );
};

module.exports = {
    data: data
};
