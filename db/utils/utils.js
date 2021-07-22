
const { client } = require('../client');
const Promise = require('bluebird');
const { deactivateCart, getActiveCart, addCart, removeProductFromCart, addProductToCart } = require('../singletables/cart');
const { flip } = require('lodash');

const userSize = 1980;        //the number of users in the db
const productSize = 231;    //The number of products in the db
const numberOfSessions = 2000; //will seed this many sessions
/*
-select random user and date.
-random user clicks a random number of products.
-some of those clicks move on to cart, some dont. If cart has itmes more than 30 days old then empty cart first.
-the ones that become cart some are removed. Add to date a random number of days up to 30.
-the ones that remain could be bought or not. Add to date the random number of removed plus some more. up to 45.



generate random clicks with random products, random users
- some of the random view clicks turn into add-to-cart clicks. So add product to the cart of that user and to the click of that user.
-some of the cart clicks turn into remove from cart clicks.
-some of the carts turn into 'processing' and turn their clicks into buy clicks.

*/

//this function will seed clicks, carts, and purchases
async function userSession() {
    const userId = Math.floor(Math.random() * userSize);
    
    const initialDate = Math.floor(new Date(2020, 0).getTime());
    const finalDate = Math.floor(new Date(2021, 0).getTime());
    const dateEpoch = Math.floor((Math.random() * (finalDate - initialDate)) + initialDate);
    const date = new Date(dateEpoch);
    const numberOfActions = Math.floor((Math.random() * 40) + 1);
    const actionsArray = [];
    for (let i = 0; i < numberOfActions; i++) { actionsArray.push(i); }
    
    
    try {
        let { id: cartId } = await getActiveCart(userId);
        //a user's session. May view many items, may put some in cart, may remove some, may or may not buy the cart.
        await Promise.each(actionsArray, async (action) => {
            try {
                const productId = Math.floor((Math.random() * (productSize - 1)) + 1);
                
                //add one view click
                const { rows: [ click ]} = await client.query(`
                    INSERT INTO clicks (viewclick, viewtime, productid, userid, cartid)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
        `, [true, date, productId, userId, null]);

        

            //now I have userId, productId, date, and click.
            //if flip coin is true then:
            //need to get cart. Then add this click to cart.

            if (flipCoin()) {
                
                
                //get product price
                const { rows: [{price: unitPrice} ]} = await client.query(`
                    SELECT price FROM products
                    WHERE id = $1;
                `, [productId]);

                //add this product to cart (products_carts)
                await addProductToCart({ userId, productId, cartId, quantity: 1, unitPrice});

                //now add cart-click to this click
                await client.query(`
                    UPDATE clicks
                    SET cartclick = $1,
                    carttime = $2
                    WHERE id = $3;
                `, [ true, date, click.id ]);

                
                //flip coint again to decide to remove or not to
                if (flipCoin()) {
                    //remove from click (add removecart = true)
                    await client.query(`
                        UPDATE clicks
                        set removecart = $1,
                        removetime = $2
                        WHERE id = $3;
                    `, [true, date, click.id]);

                    //get productsCartsId in order to remove product from cart
                    const { rows: [ { jointId: productsCartsId }]} = await client.query(`
                        SELECT "jointId"
                        FROM products_carts
                        WHERE "cartId" = $1
                        AND "productId" = $2; 
                    `, [ cartId, productId]);
                    //remove from cart
                    
                    await removeProductFromCart({ userId, cartId, products_cartsId: productsCartsId});

                    
                }

                }

            } catch (error) {
                console.error('error within the bluebird Promise.map in utils', error);
            } 
        }); //end of Promise.each (session)

        //at this point many items were viewed, some added to cart, some removed.
        //flip coin to see if this cart should be bought or not. Cart will be identified by userId
        //check to see if cart is empty also. If emtpy then don't buy.
        
        // if (flipCoin()) {
        if (true) {
            //check to see if cart is empty

            const { cartQuantity } = await getActiveCart(userId);

            if (cartQuantity > 0) {
                //deactivate cart (it will in turn create a new empty cart)
                //change all the clicks that have that cartId into buy=true
                const cart = await deactivateCart({userId, cartId});

                //update all clicks to reflect buying
                await client.query(`
                    UPDATE clicks
                    set buyclick = $1,
                    buytime = $2
                    WHERE cartid = $3;
                `, [true, date, cartId]);

                
            }
            

            
        }
    } catch (error) {
        console.error('error at the viewClick function in the utils folder', error);
    }


}


async function seedClicks() {
    try {
        const array = [];
        for (let i = 0; i < numberOfSessions; i++) {
            array.push(i);
        }
        await Promise.each(array, async () => {
            try {
                await userSession();
            } catch (error) {
                console.error('error in the seedClicks', error);
            }
        })
        
    } catch (error) {
        console.error('error seeding clicks', error);
    }
}

function flipCoin() {
    return Math.random() < 0.5;
}

module.exports = { 
    seedClicks 
};