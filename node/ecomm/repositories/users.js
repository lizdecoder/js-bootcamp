const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        // Sync functions are not performant, but jusitifcation is only one instance
        try{
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // open the file called this.filename
        // read its contents
        // parse the contents
        // return parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    }

    async create(attrs) {
        // add random ID at creation
        attrs.id = this.randomID();
        // {email: '', password: ''}
        const records = await this.getAll();
        records.push(attrs);
        
        await this.writeAll(records);
    }

    async writeAll(records) {
        // write updated 'records' array back to 'users.jason'
        // null = no customizer
        // 2 = 2 spaces indentation
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    } 

    randomID() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        // filtered method returns true for records not equal to id passed in
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        // iterate through all records and find the record that matches id passed in
        const record = records.find(record => record.id === id);

        // check to see if record has been found
        if (!record) {
            throw new Error(`Record with id ${id} not found!`);
        }
        // update record by adding all properties from attrs to it
        Object.assign(record, attrs);
        // write back all records with updates
        await this.writeAll(records);
    }
}

// test
const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.update("4c612106", {password: 'mypassword'});

};

test();