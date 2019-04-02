const mysql = require('../database/mysql');
const socketIO = require('./socket');

// Obtain the complete History of sensor logs
const getHistory = async function getHistory(req, res) {
    return res.send( await mysql.query('SELECT * FROM history ORDER BY timestamp DESC') );
};

const insertSensor = async function insertSensor(req, res, next) {
    if(!res.locals.isInserted) {
        await mysql.query('INSERT INTO sensors VALUES (NULL,?,?,NOW())',
            [req.body.deviceID, req.body.battery]);
    }

    next(); // Go to update History
};

// Update the sensor data or inserts a new row
const updateSensor = async function updateSensor(req, res, next) {
    res.end();  // Close the connection with the sensor

    let result = await mysql.query('UPDATE sensors SET battery = ?, timestamp = NOW() WHERE deviceID = ?',
        [req.body.battery, req.body.deviceID]);

    res.locals.isInserted = result.affectedRows;
    next(); // Go to insert Sensor
};

// Insert the sensor log into History
const updateHistory = async function updateHistory(req, res) {
    // Get the deviceName of the sensor
    let sensor = await mysql.query('SELECT deviceName FROM sensors WHERE deviceID = ?', [req.body.deviceID]);

    let lastSensor;
    try {
        // Get the deviceID of the last insert
        lastSensor = await mysql.query('SELECT deviceID FROM history ORDER BY timestamp DESC LIMIT 1');
        lastSensor = lastSensor[0].deviceID;
    } catch (error) {
        lastSensor = '';
    }

    // Insert if there're not any row in the table
    if(lastSensor === '') {
        // Insert a new row into history table with a custom name (if exists)
        await mysql.query('INSERT INTO history VALUES (?,?,?,NOW())',
            [sensor[0].deviceName || null, req.body.deviceID, 0]);
    }

    // Insert if the last ID is different
    else if(req.body.deviceID !== lastSensor) {
        // Update the duration in ms of the last location
        await mysql.query('UPDATE history SET duration = ? WHERE deviceID = ? ORDER BY timestamp DESC LIMIT 1',
            [5, lastSensor]);
            //TODO: el 5 se tiene que cambiar por la diferencia de tiempo (ms)
            //new Date().getTime() - new Date(self.getTable()[0].timestamp).getTime()
        // Insert a new row into history table with a custom name (if exists)
        await mysql.query('INSERT INTO history VALUES (?,?,?,NOW())',
            [sensor[0].deviceName || null, req.body.deviceID, 0]);
    }

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
