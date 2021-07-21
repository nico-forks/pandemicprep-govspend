const express = require('express');
const clicksRouter = express.Router();

const { addViewClick, addCartClick, addBuyClick, removeFromCart, getUserClicks } = require('../db/singletables/clicks');






clicksRouter.get('/', async function (req, res) {
    console.log('getting to get clicks...')
    if (req.user) {
        try {
            const clicks = await getUserClicks(req.user.id);
            res.send(clicks);
        } catch (error) {
            console.error('error getting to the clicks', error);
        }
    }
})


//Add view click to a product

clicksRouter.post('/view', async (req, res) => {
    
    if (req.user) {
		const { productId, userId } = req.body;
        try {
            const newViewClick = await addViewClick(productId, userId);
            
            res.send(newViewClick);
        } catch (error) {
            console.error('Error at the router post /view', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

//Add cart click to a product
clicksRouter.post('/cart', async (req, res) => {
    if (req.user) {
		const { clickId,productId, userId, cartId } = req.body;
        try {
            const newCartClick = await addCartClick(clickId, productId, userId, cartId);
            
            res.send(newCartClick);
        } catch (error) {
            console.error('Error at the router post /cart', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

//Add buy click to a product
clicksRouter.post('/buy', async (req, res) => {
    if (req.user) {
		const { clickId, productId, userId } = req.body;
        try {
            const newBuyClick = await addBuyClick(clickId, productId, userId);
            
            res.send(newBuyClick);
        } catch (error) {
            console.error('Error at the router post /buy', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});

//add remove from cart click to a product
clicksRouter.post('/remove', async (req, res) => {
    if (req.user) {
		const { clickId, productId, userId } = req.body;
        try {
            const newRemove = await removeFromCart(clickId, productId, userId);
            
            res.send(newRemove);
        } catch (error) {
            console.error('Error at the router post /remove', error);
        }
    
} else {
    next({ message: 'Must be signed in to add a click' });
}
});


module.exports = clicksRouter;