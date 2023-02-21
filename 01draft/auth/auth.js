/// Authorizes registered users

const { verify } = require('jsonwebtoken');
const winston = require('winston');

module.exports = {
    checkToken: (req,res,next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, process.env.JWT_TOKEN, (err,decoded) => {
                if (err) {
                    winston.error('Access denied. Invalid token.'+token);
                    return res.status(401).send("Invalid email or password");
                } else {
                    next();
                }
            });
        } else {
            winston.error('Access denied. Unauthorized user.');
            return res.status(400).send("Access denied. Unauthorized user."+token);
        }
    }
};