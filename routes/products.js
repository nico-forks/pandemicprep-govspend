const express = require('express');
const productsRouter = express.Router();

const {
    getProductsByQuery,
    addProductAndCategory,
    getProductById,
    getProductsByCategory,
    getHighlightedProducts,
    getAllProductNamesAndIds
} = require('../db/singletables/products');

//Initial load of main page where products.isHighlighted is true
productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getHighlightedProducts();

        res.send(products);
    } catch (error) {
        next(error);
    }
});

productsRouter.get('/all', async (req, res, next) => {
    try {
        if (req.user.isAdmin) {
            const products = await getAllProductNamesAndIds();
            res.send(products);
        } else {
            throw new Error('unauthorized user');
        }
    } catch (error) {
        next(error);
    }
});

//Gets product(s) by sending a searchString to the db
productsRouter.get('/:query/:pageNumber', async (req, res, next) => {
    try {
        const { query, pageNumber } = req.params;
        const queryProducts = await getProductsByQuery(query, pageNumber);

        res.send(queryProducts);
    } catch (error) {
        next(error);
    }
});

//Adds a new product
productsRouter.post('/', async (req, res, next) => {
    try {
        const product = req.body;
        const newProduct = await addProductAndCategory(product);

        res.send(newProduct);
    } catch (error) {
        next(error);
    }
});

//Gets a product by id (to be used in other functions)
productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await getProductById(productId);

        res.send(product);
    } catch (error) {
        next(error);
    }
});

//Gets all products in a specific category
productsRouter.get('/category/:categoryName/:pageNumber', async (req, res, next) => {
    try {
        const { categoryName, pageNumber } = req.params;
        const products = await getProductsByCategory(categoryName, pageNumber);

        res.send(products);
    } catch (error) {
        next(error);
    }
});




module.exports = productsRouter;