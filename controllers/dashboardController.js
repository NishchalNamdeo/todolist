const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.dashboard = async function(req, res) {
    try {
        // Extract userId from the decoded JWT stored in req.user
        const userId = req.user.userId;  // Get the userId from req.user

        if (!userId) {
            return res.redirect('/login');  // Redirect if the user is not authenticated
        }

        // Find the user in the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');  // Handle case if user doesn't exist
        }

        // Find tasks related to this user
        const userTasks = await Dashboard.find({ userId: userId });

        // Render the dashboard page with the user's tasks
        return res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            dashboard: userTasks
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
