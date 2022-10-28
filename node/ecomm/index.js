const { application } = require('express');
const express = require('express');

const app = express();

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

app.post('/', (req, res) => {
    //get access to email, password, passwordConfirmation
    // req.on is equal to addEventListener
    req.on('data', data => {
        // manual code to parse data from form
        // const parsed = data.toString('utf8').split('&');
        // const formData = {};
        // for (let pair of parsed) {
        //     const [key, value] = pair.split('=');
        //     formData[key] = value;
        // }
        // console.log(formData);

        // helper function to parse data from form
        const parsed = data.toString('utf8').split('&');
        const formData = {};
        for (let pair of parsed) {
            const [key, value] = pair.split('=');
            formData[key] = value;
        }
        console.log(formData);
    });
    res.send('Account created!');
});

// app to start listening to network requests on specific port; i.e. 3000
// if receive error means another process is running on port [3000]
app.listen(3000, () => {
    console.log('Listening');
});