#!/usr/bin/env node 

//fs = file system
const fs = require('fs');

// using process.cwd for current work directory instead of "." to be
// compatible with other OS
fs.readdir(process.cwd(), (err, filenames) => {
    // either err === an error object, or err === null everything is okay
    if (err) {
        // error handling code here
        console.log(err); //not ideal because other code will run
        // console log requires return to not run error
        // throw new Error(err); more ideal
    }
    // BAD CODE HERE for learning purposes
    for (let filename of filenames) {
        fs.lstat(filename, (err, stats) => {
            if (err) {
                console.log(err);
            }
            console.log(filename, stats.isFile());
        });
    }
    // BAD CODE COMPLETE
});
