const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const {requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route for list all products
router.get('/admin/products', (req, res) => {

});

// route to show a form to allow admin to create a new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

// route to submit form
router.post('/admin/products/new', [requireTitle, requirePrice], upload.single('image'), (req, res) => {
    const errors = validationResult(req);
    // console.log(errors)
    console.log(req.file);
    res.send('submitted');
});
// route to allow admin to edit
// route submitting editing form
// route deletion of product

module.exports = router;