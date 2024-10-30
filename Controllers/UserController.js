const Controller = require("./Controller")
const jwt = require("jsonwebtoken")
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

class UserController extends Controller {}

UserController.loadUsers = async (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, '../Data/Users.json'));
    return JSON.parse(data);
}

UserController.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await UserController.loadUsers();

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }    
        
        let accessToken = jwt.sign(
            {
                id: Math.floor(Math.random() * 90000) + 10000,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        )

        res.header("Authorization", "Bearer " + accessToken)
        res.cookie("accessToken", accessToken, { maxAge: 90000000, httpOnly: true })
        res.json({
            status: true,
            accessToken,
            name: user.username,
            is_verified: true
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login.' });
    }
}
module.exports = UserController
