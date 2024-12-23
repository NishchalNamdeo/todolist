const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User= require("../models/register")

module.exports.register = function(req, res){
    return res.render('register', { 
        title: "Register"
    });
}
module.exports.login = function(req, res){
     res.render('login'
    );
}


// Register Controller
exports.registerpost = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        // Save user in the database
        const savedUser = await newUser.save();

        // Create JWT token
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in a cookie (httpOnly for security)
        res.cookie('token', token, {
            httpOnly: true,  // Prevent client-side JavaScript access
        });

        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};


// Login Controller
exports.loginpost = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in a cookie (httpOnly for security)
        res.cookie('token', token, {
            httpOnly: true,  // Prevents client-side JavaScript from accessing the token
        });

        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

// Logout Controller
exports.logout = (req, res) => {
    try {
        // Clear the JWT token from the cookie
        res.clearCookie('token');
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during logout' });
    }
};



