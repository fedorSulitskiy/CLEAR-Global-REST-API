/// Function to generate a jsonwebtoken
const { sign } = require('jsonwebtoken');

module.exports = function(details) {
    const token = sign(details, process.env.JWT_TOKEN, {
        expiresIn: "1h",
    });
    return token;
}