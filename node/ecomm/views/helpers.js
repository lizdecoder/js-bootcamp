module.exports = {
    getError(errors, prop) {
        //prop === 'email' or 'password' or 'passwordConfirmation'
        // if (errors) {
        //     //errors.mapped() === {email: {msg: 'Invalid Email' }, password: {msg: 'password too short'}, passwordConfirmation: {msg: 'passwords must match'}}
        //     return errors.mapped()[prop].msg;
        // }
        try {
            return errors.mapped()[prop].msg;
        } catch (err) {
            return '';
        }
    }
};