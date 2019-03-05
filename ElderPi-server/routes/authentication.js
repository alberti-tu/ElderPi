const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'ElderPi';

// Generates a seasson token for a given user
const createToken = function createToken(id) {
    let payload = {
        userID: id,
        expiration: moment().add(14, "days").unix(),
    };
    return jwt.encode(payload, secret);
};

// Check that the seasson token is valid
const checkToken = function checkToken(req, res, next) {
    if(!req.headers.authorization) return res.status(403).send('Request without header authentication');

    let token = req.headers.authorization;
    let payload = jwt.decode(token, secret);

    if(payload.expiration <= moment().unix()) return res.status(401).send('This token is not valid');

    //User authenticated
    return next();
};

module.exports = {
    createToken: createToken,
    checkToken: checkToken
};
