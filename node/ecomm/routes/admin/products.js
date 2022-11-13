const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const {requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// route for list all products
router.get('/admin/products', (req, res) => {

});

// route to show a form to allow admin to create a new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

// route to submit form
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
    const errors = validationResult(req);
    // console.log(errors)
    req.on('data', data => {
        console.log(data.toString());
    });
    res.send('submitted');
});
// route to allow admin to edit
// route submitting editing form
// route deletion of product

module.exports = router;