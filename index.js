require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path");

const AuthMiddleware = require("./Middleware/Auth/AuthMiddleware");

const port = process.env.PORT || '4000';

const allowedOrigins = [
    "http://138.68.70.115",
    "http://localhost:3000"
]

const options = {
    origin: allowedOrigins
}

app.use(cors(options)) 
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require("./Routes/User")(app, AuthMiddleware);

console.log(`Node environment: ${process.env.NODE_ENV}`)
app.listen(port, () => {
    console.log(`Example app listening at port http://138.68.70.115:${port}`)
})

