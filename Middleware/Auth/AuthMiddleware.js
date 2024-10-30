const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"]
    let accessToken

    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")
        accessToken = bearer[1]
    }

    if (!accessToken) {
        throw new Error("Invalid Token")
    }

    try {
        req.user = jwt.verify(accessToken, process.env.JWT_SECRET)
    } catch (error) {
        return res.send({
            status: false,
            message: "Please Login again",
            payload: []
        })
    }
    next()
}
