const nodemailer = require('nodemailer');
const mysql = require('../database/mysql');
const socket = require('./socket');

let transporter = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: 'notification.elderpi@gmail.com',
            pass: 'RaspberryPi3'
        }
    });

const sendAdvice = async function sendAdvice(sensor) {
    let address = await mysql.query('SELECT * FROM notifications');

    let name = '';
    for(let i = 0; i < address.length; i++) {
        name = sensor.deviceName || sensor.deviceID;
        let body = {
        from: 'notification.elderpi@gmail.com',
        to: address[i].email,
        subject: 'Timeout for sensor: ' + name,
        text: 'Dear sir,\n' +
            'Your sensor ' + name + ' has exeeded the time of inactivity.\n' +
            'Please, check that everybody is okay.\n\n' +
            'Best regards, the ElderPi team.'
        };

        //Send notifications
        transporter.sendMail(body); // e-mail
    }

    socket.sendAdvice(sensor);  // Web Socket
    console.error('Timeout for sensor: ' + name)

};

module.exports = {
    sendAdvice: sendAdvice
};
