const jwt = require('jsonwebtoken');
const secretJWT = '623262f1c9c9490399bd13d4868aa832'
const decodeToken = (token) => {
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, secretJWT);

        // Return the decoded payload
        return decoded;
    } catch (error) {
        // If token verification fails, handle the error
        console.error('Error decoding token:', error);
        return null;
    }
};

module.exports = decodeToken;