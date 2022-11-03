const { application } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');

const app = express();

// applies middleware function to all route handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // used to encrypt data
    keys: ['dkfajsdflkadsjfklsdjfklasjdf']
}));

// app to start listening to network requests on specific port; i.e. 3000
// if receive error means another process is running on port [3000]
app.listen(3000, () => {
    console.log('Listening');
});