const express = require('express');
const router = express.Router();
const {home} = require('../controllers/homeController');
const{dashboard} = require('../controllers/dashboardController');
const{register,registerpost, logout, loginpost, login} = require('../controllers/registerController');
const {alltask, addTask, deleteTask, completeTask, editTaskform, updateTask} = require('../controllers/alltaskController');
const {completedtask} = require('../controllers/completedtaskController');
const { isLoggedin} = require("../middlewares/auth");

router.get('/', home);
router.get('/dashboard',isLoggedin, dashboard);
router.get('/register',register); // registerController.register should be defined
router.get('/login', login); // registerController.login should be defined
router.get('/alltask',isLoggedin,alltask);
router.get('/completedtask',isLoggedin, completedtask);
router.post('/login',loginpost);  // registerController.loginpost should be defined
router.post('/register', registerpost);  // registerController.loginpost should be defined
router.get('/logout',logout);  // registerController.logout should be defined
router.post('/addtask',isLoggedin,addTask);
router.get('/edit-task', editTaskform); // Using :id to fetch the task

// POST route to update the task
router.post('/update-task', updateTask); 

// Route for completing a task
router.get('/complete-task', completeTask);

// Route for deleting a task
router.get('/delete-task',deleteTask);

module.exports = router;
