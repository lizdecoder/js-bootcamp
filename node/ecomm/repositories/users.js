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
        const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
        // read its contents
        console.log(contents);
        // parse the contents

        // return parsed data
    }
}

// test
const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.getAll();
};

test();