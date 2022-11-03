const { application } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

// applies middleware function to all route handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['dkfajsdflkadsjfklsdjfklasjdf']
}));

// route handler: what app should do when it receives a network request
app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `);
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
app.post('/', async (req, res) => {
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

    const { email, password, passwordConfirmation } = req.body;

    const exisitingUser = await usersRepo.getOneBy({ email });
    if (exisitingUser) {
        return res.send('Email already in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // create user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // store ID of that user inside the users cookie
    // installed third party package to manage users cookie
    

    res.send('Account created!');
});

// app to start listening to network requests on specific port; i.e. 3000
// if receive error means another process is running on port [3000]
app.listen(3000, () => {
    console.log('Listening');
});