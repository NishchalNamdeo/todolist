const express = require('express');
const port = 3000;
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');



app.use(cookieParser());

app.use(express.urlencoded({ extended: true })); // For parsing form data (application/x-www-form-urlencoded)
app.use(express.json()); // For parsing JSON (application/json)
// set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// path: routes\index.js
app.use('/', require('./routes/index'));



// set up the middleware


// set up the static files
app.use(express.static('assets'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }
    console.log(`Yupp! Server is running on port ${port}`);
});
