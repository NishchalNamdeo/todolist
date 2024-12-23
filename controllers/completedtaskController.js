const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.completedtask = async function(req, res) {
    try {
        // Get the user's ID from req.user (assuming req.user contains the authenticated user's ID)
        const userId = req.user.userId;  

        // Fetch the user from the database using the user ID
        const user = await User.findById(userId);
        
        // Check if user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Fetch tasks of the logged-in user
        const data = await Dashboard.find({ userId: user._id });

        // Render the completedtask page with user data and only their tasks
        return res.render('completedtask', {
            title: "Dashboard",
            name: user.name,
            dashboard: data  // Only tasks for the logged-in user
        });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
};
