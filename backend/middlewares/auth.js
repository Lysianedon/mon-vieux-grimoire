const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.auth = {
            userId: decodedToken.userId
        }
        next();
    } catch (error) {
        res.status(401).json(error)
    }
}