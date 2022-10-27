const express = require('express');

const app = express();

// route handler: what app should do when it receives a network request
app.get('/', (req, res) => {
    res.send('hi there!');
});

// app to start listening to network requests on specific port; i.e. 3000
// if receive error means another process is running on port [3000]
app.listen(3000, () => {
    console.log('Listening');
});