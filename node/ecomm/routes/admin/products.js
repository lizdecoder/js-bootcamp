const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middlewares');
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
router.post('/admin/products/new', upload.single('image'), [requireTitle, requirePrice], handleErrors(productsNewTemplate), async (req, res) => {
    
    // console.log(errors)
    // console.log(req.file.buffer.toString('base64'));
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send('submitted');
});
// route to allow admin to edit
// route submitting editing form
// route deletion of product

module.exports = router;