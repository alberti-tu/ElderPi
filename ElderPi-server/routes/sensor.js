const mysql = require('../database/mysql');
const socketIO = require('./socket');
const notification = require('./notification');

let idTimeOut = 0;

// Obtains the complete History of sensor logs
const getHistory = async function getHistory(req, res) {
    return res.send( await mysql.query('SELECT * FROM history ORDER BY timestamp DESC') );
};

// Inserts a new row in the table sensor
const insertSensor = async function insertSensor(req, res, next) {
    if(!res.locals.isInserted) {
        await mysql.query('INSERT INTO sensors VALUES (NULL,?,?,NOW())',
            [req.body.deviceID, req.body.battery]);
    }

    next(); // Go to update History
};

// Updates the sensor data or inserts a new row
const updateSensor = async function updateSensor(req, res, next) {
    res.end();  // Close the connection with the sensor

    let result = await mysql.query('UPDATE sensors SET battery = ?, timestamp = NOW() WHERE deviceID = ?',
        [req.body.battery, req.body.deviceID]);

    res.locals.isInserted = result.affectedRows;
    next(); // Go to insert Sensor
};

// Inserts the sensor log into History
const updateHistory = async function updateHistory(req, res) {
    // Get the sensor
    let sensor = await mysql.query('SELECT * FROM sensors WHERE deviceID = ?', [req.body.deviceID]);

    // Get the deviceID of the last insert
    let lastSensor = await mysql.query('SELECT * FROM history ORDER BY timestamp DESC LIMIT 1');

    // Inserts if there're not any row in the table
    if(lastSensor.length === 0) {
        // Insert a new row into history table with a custom name (if exists)
        await mysql.query('INSERT INTO history VALUES (?,?,?,NOW())',
            [sensor[0].deviceName || null, req.body.deviceID, 0]);
    }

    // Inserts if the last ID is different
    else if(req.body.deviceID !== lastSensor[0].deviceID) {
        // Updates the duration in ms of the last location
        let duration = new Date().getTime() - new Date(lastSensor[0].timestamp).getTime();
        await mysql.query('UPDATE history SET duration = ? WHERE deviceID = ? ORDER BY timestamp DESC LIMIT 1',
            [duration, lastSensor[0].deviceID]);

        // Inserts a new row into history table with a custom name (if exists)
        await mysql.query('INSERT INTO history VALUES (?,?,?,NOW())',
            [sensor[0].deviceName || null, req.body.deviceID, 0]);

        //Start the advice Timeout
        clearTimeout(idTimeOut);
        idTimeOut = setTimeout(function () {
            notification.sendAdvice(sensor[0]);
        }, 60000);  // 10min
    }

    socketIO.updateClient();
};

// Sets a custom name for the device
const updateNameDevice = async function updateNameDevice(req, res) {
    // Updates the deviceName in sensor table
    await mysql.query('UPDATE sensors SET deviceName = ? WHERE deviceID = ?',
        [req.body.deviceName, req.body.deviceID]);

    // Updates the deviceName in history table
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
