#!/usr/bin/env node 

//fs = file system
const chalk = require('chalk')
const fs = require('fs');
const path = require('path');

// method #2 lstat with promise
// const util = require('util');
// const lstat = util.promisify(fs.lstat);

// method #3 BEST - uses promise-based function
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

// using process.cwd for current work directory instead of "." to be
// compatible with other OS
fs.readdir(targetDir, async (err, filenames) => {
    // either err === an error object, or err === null everything is okay
    if (err) {
        // error handling code here
        console.log(err); //not ideal because other code will run
        // console log requires return to not run error
        // throw new Error(err); more ideal
    }
    // BAD CODE HERE for learning purposes - does not keep order
    // for (let filename of filenames) {
    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log(filename, stats.isFile());
    //     });
    // }
    // // BAD CODE COMPLETE

    // GOOD CODE HERE: Option #1 - does not allow for more complexities
    // const allStats = Array(filenames.length).fill(null);
    
    // for (let filename of filenames) {
    //     const index = filenames.indexOf(filename);
        
    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         allStats[index] = stats;
    //         // every() returns boolean; if full still have null value
    //        const ready = allStats.every((stats)=> {
    //             return stats;
    //         });
    //         if (ready) {
    //             allStats.forEach((stats, index) => {
    //             console.log(filenames[index], stats.isFile());        
    //             }); 
    //         }
    //     });
    // }

    // GOOD CODE HERE: Option #2 with async & promise
    // implementation is not ideal - only one lstat operation at a time
    // not performant, never in parallel
    // for (let filename of filenames) {
    //     try {
    //     const stats = await lstat(filename);
    //     console.log(filename, stats.isFile());
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // GREAT CODE HERE: Option #3 - processes many lstat ops in parallel
    const statPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename));
    });
    // all lstat ops in parallel
    const allStats = await Promise.all(statPromises);

    for (let stats of allStats) {
        const index = allStats.indexOf(stats);

        if (stats.isFile()) {
            console.log(filenames[index])
        }else {
        console.log(chalk.bold(filenames[index]));
        }
    }
});

// wrapping lstat in promise method #1
// const lstat = (filename) => {
//     return new Promise((resolve, reject) => {
//         fs.lstat(filename, (err, stats) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(stats);
//         });
//     });
// };