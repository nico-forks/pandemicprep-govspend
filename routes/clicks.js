const express = require('express');
const clicksRouter = express.Router();

const { addViewClick, addCartClick, addBuyClick, removeFromCart } = require('../db/singletables/clicks');



//Add view click to a product

clicksRouter.post('/view', async (req, res) => {
    console.log('getting to the add view at the back...')
    if (req.user) {
		const { productId, userId } = req.body;
        try {
            const newViewClick = await addViewClick(productId, userId);
            
            res.send(newViewClick);
        } catch (error) {
            console.error('Error at the router post /addview', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

//Add view click to a product
clicksRouter.post('/cart', async (req, res) => {
    if (req.user) {
		const { clickId,productId, userId } = req.body;
        try {
            const newCartClick = await addCartClick(clickId, productId, userId);
            
            res.send(newCartClick);
        } catch (error) {
            console.error('Error at the router post /addview', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

//Add view click to a product
clicksRouter.post('/buy', async (req, res) => {
    if (req.user) {
		const { clickId, productId, userId } = req.body;
        try {
            const newBuyClick = await addBuyClick(clickId, productId, userId);
            
            res.send(newBuyClick);
        } catch (error) {
            console.error('Error at the router post /addview', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

clicksRouter.post('/remove', async (req, res) => {
    if (req.user) {
		const { clickId, productId, userId } = req.body;
        try {
            const newRemove = await removeFromCart(clickId, productId, userId);
            
            res.send(newRemove);
        } catch (error) {
            console.error('Error at the router post /addview', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});


module.exports = clicksRouter;