const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'ElderPi';

// Generates a seasson token for a given user
const createToken = function createToken(id) {
    let payload = {
        userID: id,
        //expiration: moment().add(1, "days").unix(),
        expiration: moment().add(1, "day").unix()
    };
    return jwt.encode(payload, secret);
};

// Obtain the token from the header request
const getToken = function getToken(req, res, next) {
    if(!req.headers.authorization) return res.status(403).send('Request without header authentication');

    if(validateToken(req.headers.authorization) === false) return res.status(401).send('This token is not valid');

    //User authenticated
    return next();
};

// Check that the seasson token is valid
const validateToken = function validateToken(token) {
    let payload = jwt.decode(token, secret);
    return payload.expiration > moment().unix();
};

module.exports = {
    createToken: createToken,
    getToken: getToken,
    validateToken: validateToken
};
