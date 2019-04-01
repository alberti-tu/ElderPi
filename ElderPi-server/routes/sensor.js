const mysql = require('../database/mysql');
const socketIO = require('./socket');

// Obtain the complete History of sensor logs
const getHistory = async function getHistory(req, res) {
    return res.send( await mysql.query('SELECT * FROM history ORDER BY timestamp DESC') );
};

const insertSensor = async function insertSensor(req, res, next) {
    if(!res.locals.isInserted) {
        await mysql.query('INSERT INTO sensors VALUES (NULL,?,?,?,NOW())',
            [req.body.deviceID, req.body.precense, req.body.battery]);
    }

    next(); // Go to update History
};

// Update the sensor data or inserts a new row
const updateSensor = async function updateSensor(req, res, next) {
    res.end();  // Close the connection with the sensor

    let result = await mysql.query('UPDATE sensors SET precense = ?, battery = ?, timestamp = NOW() WHERE deviceID = ?',
        [req.body.precense, req.body.battery, req.body.deviceID]);

    res.locals.isInserted = result.affectedRows;
    next(); // Go to insert Sensor
};

// Insert the sensor log into History
const updateHistory = async function updateHistory(req, res) {
    let deviceName = await mysql.query('SELECT deviceName FROM sensors WHERE deviceID = ?', [req.body.deviceID]);
    await mysql.query('INSERT INTO history VALUES (?,?,?,NOW())',
        [deviceName[0].deviceName || null, req.body.deviceID, req.body.precense, req.body.battery]);
    socketIO.updateClient();
};

// Set a custom name for the device
const updateNameDevice = async function updateNameDevice(req, res) {
    // Update the deviceName in sensor table
    await mysql.query('UPDATE sensors SET deviceName = ? WHERE deviceID = ?',
        [req.body.deviceName, req.body.deviceID]);

    // Update the deviceName in history table
    await mysql.query('UPDATE history SET deviceName = ? WHERE deviceID = ?',
        [req.body.deviceName, req.body.deviceID]);

    res.end();

    socketIO.updateClient();
};

module.exports = {
    getHistory: getHistory,
    insertSensor: insertSensor,
    updateSensor: updateSensor,
    updateHistory: updateHistory,
    updateNameDevice: updateNameDevice
};
