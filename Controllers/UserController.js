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

// Save users to the JSON file
UserController.saveUsers = async (users) => {
    try {
        fs.writeFileSync(path.join(__dirname, '../Data/Users.json'), JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error saving users:", error);
    }
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
                username: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        )

        res.header("Authorization", "Bearer " + accessToken)
        res.cookie("accessToken", accessToken, { maxAge: 90000000, httpOnly: true })
        res.json({
            status: true,
            accessToken,
            name: user.email,
            is_verified: true
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login.' });
    }
}

UserController.signup = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const users = await UserController.loadUsers();

        // Check if the user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

        // Create new user object
        const newUser = {
            id: Math.floor(Math.random() * 90000) + 10000, // Simple ID generation, consider a better approach for production
            email,
            password: hashedPassword,
            username,
        };

        // Add the new user to the users array
        users.push(newUser);

        // Save the updated users array back to the JSON file
        await UserController.saveUsers(users);

        let accessToken = jwt.sign(
            {
                id: Math.floor(Math.random() * 90000) + 10000,
                username: newUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        )

        res.header("Authorization", "Bearer " + accessToken)
        res.cookie("accessToken", accessToken, { maxAge: 90000000, httpOnly: true })
        res.json({
            status: true,
            accessToken,
            name: newUser.email,
            is_verified: true
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during signup.' });
    }
}

module.exports = UserController
