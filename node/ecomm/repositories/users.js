const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async create(attrs) {
        // attrs === { email: '', password:''}
        // add random ID at creation
        attrs.id = this.randomID();
        // initializing salt & hash
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);
        
        const records = await this.getAll();
        // records.push({
        //     // ...attrs = take all properties from attrs
        //     ...attrs,
        //     // replace plain text password from attrs into encoded password
        //     password: `${buf.toString('hex')}.${salt}`
        // });
        const record = {
            // ...attrs = take all properties from attrs
            ...attrs,
            // replace plain text password from attrs into encoded password
            password: `${buf.toString('hex')}.${salt}`
        };

        records.push(record);
        
        await this.writeAll(records);

        return record;
    }

    async comparePasswords(saved, supplied) {
        // saved - password saved in our database. 'hashed.salt'
        // supplied - password given to us by user trying to sign in
        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];
        // single line for the three above ^
        const [hashed, salt] = saved.split('.')
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }
}

// Exporting methods
// method #1: exporting full class
// module.exports = UsersRepository;
// requires this in another file....
// not ideal approach
// const UsersRepository = require('./users');
// const repo = new UsersRepository('users.json')

// method #2: exporting an instance of the class
// can call methods immediately in another file
// only idea because we only need one instance of this class
module.exports = new UsersRepository('users.json');


// test
// const test = async () => {
//     const repo = new UsersRepository('users.json');

//     const user = await repo.getOneBy({ hello: 'askdlfasl' });
//     console.log(user)

// };

// test();