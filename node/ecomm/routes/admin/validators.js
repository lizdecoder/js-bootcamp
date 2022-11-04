const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    // always add santization before validators
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            const exisitingUser = await usersRepo.getOneBy({ email });
            if (exisitingUser) {
                throw new Error('Email is already in use.');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 and 20 characters')
        .custom(async (passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match.');
            }
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide a valid email.')
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error('Email not found!');
            }
        }),
    requireValidPasswordForUser: check('password')
        .trim()
        .custom(async (password, { req }) => {
            // get user we are checking for
            const user = await usersRepo.getOneBy({ email: req.body.email });
            // if user does not exist throw error
            if (!user) {
                throw new Error('Invalid password.(1)');
            }
            // compare password in databased to entered password
            const validPassword = await usersRepo.comparePasswords(user.password, password);
            // if password does not match user's password
            if (!validPassword) {
                throw new Error('Invalid password.(2)')
            }
        })
};