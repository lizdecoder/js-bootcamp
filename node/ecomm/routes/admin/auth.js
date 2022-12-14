const express = require('express');

const { handleErrors } = require('./middlewares')
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require ('../../views/admin/auth/signin');
const { 
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation, 
    requireEmailExists, 
    requireValidPasswordForUser 
} = require('./validators');

// sub-router to support all route handlers
const router = express.Router();

// route handler: what app should do when it receives a network request
router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

// Attempt #2 to parse data
// Middleware helper function to parse data from form
// next is a callback function that comes from express app
// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', data => {
//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     }
// };

// Attempt #3 to parse data
// uses outside library for middleware function bodyParser.urlencoded()
// route handlers
router.post('/signup', [requireEmail, requirePassword,requirePasswordConfirmation], handleErrors(signupTemplate), 
async (req, res) => {
    //get access to email, password, passwordConfirmation
    // req.on is equal to addEventListener
    // Attempt #1 to parse data
    // manual code to parse data from form
    // req.on('data', data => {
        // const parsed = data.toString('utf8').split('&');
        // const formData = {};
        // for (let pair of parsed) {
        //     const [key, value] = pair.split('=');
        //     formData[key] = value;
        // }
        // console.log(formData);

    const { email, password } = req.body;

    // create user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // store ID of that user inside the users cookie
    // installed third party package to manage users cookie
    // req.session === {}//added by cookie session library!
    req.session.userId = user.id;

    res.redirect('/admin/products');
});

// signout functionality
router.get('/signout', (req, res) => {
    // needs to forget cookie data; clear out cookie data
    req.session = null;
    res.send('You are logged out');
});

// signin functionality
router.get('/signin', (req, res) => {
    // pass in empty object because template expects an errors object
    res.send(signinTemplate({}));
});

// handle signin form submission
router.post('/signin', [requireEmailExists, requireValidPasswordForUser], 
handleErrors(signinTemplate), async (req, res) => {
    // if (!errors.isEmpty()) {
    //     return res.send(signupTemplate({ req, errors }));
    // }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });
    
    // passes both checks, means user is valid
    // this user is authenticated by app
    req.session.userId = user.id;
    res.redirect('/admin/products');
});

// export router to allow other files to use router
module.exports = router;