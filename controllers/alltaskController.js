const db = require('../config/mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/register');
module.exports.alltask = async function(req, res) {
    try {
        // Get the user's ID from the authenticated user (assuming it is in req.user)
        const userId = req.user.userId;
        
        // Fetch all tasks of the logged-in user using userId
        const data = await Dashboard.find({ userId: userId });

        // Fetch user details from the User model using userId
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Render the alltask page with user data and only their tasks
        return res.render('alltask', {
            title: "Dashboard",
            name: user.name,
            dashboard: data  // Only tasks for the logged-in user
        });

    } catch (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).send("Internal Server Error");
    }
};


exports.addTask = async (req, res) => {
    const { task, date, description, time, categoryChoosed } = req.body;
    
    // Ensure req.user contains userId
    const userId = req.user && req.user.userId;  // Get the userId from req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
    }

    try {
        // Create new task
        const newTask = new Dashboard({
            task,
            date,
            description,
            time,
            categoryChoosed,
            userId // Assign the userId to the new task
        });

        // Save task to the database
        await newTask.save();
        res.redirect(req.get('Referrer') || '/');  // Redirect with safe fallback
    } catch (err) {
        console.log("Error Creating Task!!", err);
        res.status(500).json({ message: "Error creating task", error: err.message });
    }
};

// Controller to complete a task
exports.completeTask = async (req, res) => {
    const { id } = req.query;

    try {
        const updatedTask = await Dashboard.findByIdAndUpdate(id, { completed: true }, { new: true });
        console.log("Successfully Completed Task!", updatedTask);
        res.redirect(req.get('Referrer') || '/');  // Redirect with safe fallback
    } catch (err) {
        console.log("Error Completing Task!!", err);
        res.redirect(req.get('Referrer') || '/');  // Redirect with safe fallback
    }
};

// Controller to delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.query;

    try {
        const deletedTask = await Dashboard.findByIdAndDelete(id);
        console.log("Successfully Deleted Task!", deletedTask);
        res.redirect(req.get('Referrer') || '/');  // Redirect with safe fallback
    } catch (err) {
        console.log("Error Deleting Task!!", err);
        res.redirect(req.get('Referrer') || '/');  // Redirect with safe fallback
    }
};

// GET route to display the task edit form with query parameters
// Route to display the task edit form with query parameters
exports.editTaskform = async (req, res) => {
    try {
        const { id } = req.query; // Fetch task ID from query parameters
        
        const task = await Dashboard.findById(id); // Find task by ID

        if (!task) {
            console.log('Task not found'); // Log if task is not found
            return res.status(404).send('Task not found'); // Return 404 if task doesn't exist
        }

        // Render the 'edit' view and pass the task object to the template
        res.render('edit', { task });
    } catch (error) {
        console.error('Error fetching task:', error); // Log any errors encountered
        res.status(500).send('Server Error'); // Return a 500 status code in case of server error
    }
};


exports.updateTask = async (req, res) => {
    try {
      const { id } = req.query; // Get the task ID from the query string
      const { title, description} = req.body; // Get updated task details from the form
  
      // Find and update the task by its ID
      const task = await Dashboard.findByIdAndUpdate(
        id,
        { title, description },
        { new: true } // Return the updated task
      );
  
      if (!task) {
        return res.status(404).send('Task not found');
      }
  
      // Redirect to the updated task page or any page (like task list or home)
      res.redirect('/dashboard'); // Assuming you have a route to show all tasks
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Server Error');
    }
  };
  