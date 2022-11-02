const fs = require('fs');

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
        // {email: '', password: ''}
        const records = await this.getAll();
        records.push(attrs);
        // write updated 'records' array back to 'users.jason'
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}

// test
const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.create({ email: 'test@test.com', password: 'password' });
    const users = await repo.getAll();
    console.log(users);
};

test();