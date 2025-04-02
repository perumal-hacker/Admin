const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User/signup.model");

const User = require("../../models/User");

const signupUser = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email},
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({ message: "User registered successfully", token });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = signupUser;
