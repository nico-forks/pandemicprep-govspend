
const { client } = require('../client');
const Promise = require('bluebird');
const { deactivateCart, getActiveCart, addCart, removeProductFromCart, addProductToCart } = require('../singletables/cart');
const { flip } = require('lodash');




const maxTimeDelta = 630000000;

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
async function userSession(numberOfSessions) {
    
    
    const initialDate = Math.floor(new Date(2020, 0).getTime());
    const finalDate = Math.floor(new Date(2021, 0).getTime());
    const dateEpoch = Math.floor((Math.random() * (finalDate - initialDate)) + initialDate);
    let date = new Date(dateEpoch);
    const numberOfActions = Math.floor((Math.random() * 40) + 1);
    const actionsArray = [];
    for (let i = 0; i < numberOfActions; i++) { actionsArray.push(i); }
    let cartId = null;
    
    
    try {
        const userSize = await getUserCount();        //the number of users in the db
        const userId = Math.floor((Math.random() * parseInt(userSize)) + 1);
        const productSize = await getProductsCount();    //The number of products in the db
        let { id } = await getActiveCart(userId);

        console.log('user count already called', userSize);
        console.log('userId', userId );

        cartId = id;
        //a user's session. May view many items, may put some in cart, may remove some, may or may not buy the cart.
        await Promise.each(actionsArray, async (action) => {
            try {
                const productId = Math.floor((Math.random() * (productSize - 1)) + 1);
                
                //add one view click
                const click = await viewClick(date, productId, userId);
        

            //now I have userId, productId, date, and click.
            //if flip coin is true then:
            //need to get cart. Then add this click to cart.

            if (flipCoin()) {
                
                
                //get product price
                const unitPrice = await getProductPrice(productId);

                //add this product to cart (products_carts)
                await addProductToCart({ userId, productId, cartId, quantity: 1, unitPrice});

                date = new Date(date.valueOf() + timeDelta());
                
                //now add cart-click to this click
                await addCartClick(date, cartId, click.id);

                
                //flip coint again to decide to remove or not to
                if (flipCoin()) {
                    //remove from click (add removecart = true)
                    date = new Date(date.valueOf() + timeDelta());
                    
                    await addRemoveCartClick(date, click.id);

                    //get productsCartsId in order to remove product from cart
                    await removeProductFromCartInUtils(cartId, productId, userId);
                    
                }

                }

            } catch (error) {
                console.error('error within the bluebird Promise.map in utils', error);
            } 
        }); //end of Promise.each (session)

        //at this point many items were viewed, some added to cart, some removed.
        //flip coin to see if this cart should be bought or not. Cart will be identified by userId
        //check to see if cart is empty also. If emtpy then don't buy.
        console.log('cartId1', cartId);
        if (flipCoin()) {
        
            //check to see if cart is empty

            const { cartQuantity } = await getActiveCart(userId);
            console.log('cartQuantity', cartQuantity);
            if (cartQuantity > 0) {
                //deactivate cart (it will in turn create a new empty cart)
                //change all the clicks that have that cartId into buy=true
                const cart = await deactivateCart({userId, cartId});

                date = new Date(date.valueOf() + timeDelta());
                console.log('cart', cart);
                console.log('cartId2', cartId);
                console.log('date', date);
                //update all clicks to reflect buying
                await setCartClicksToBuy(date, cartId);
            }
            

            
        }
    } catch (error) {
        console.error('error at the viewClick function in the utils folder', error);
    }
}


async function viewClick(date, productId, userId) {
    try {
        const { rows: [ click ]} = await client.query(`
                    INSERT INTO clicks (viewclick, viewtime, productid, userid, cartid)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
        `, [true, date, productId, userId, null]);
        return click;
    } catch (error) {
        console.error('error at the viewClick function in the utils folder', error);
    }
}

async function getProductPrice(productId) {
    try {
        const { rows: [{price: unitPrice} ]} = await client.query(`
                    SELECT price FROM products
                    WHERE id = $1;
                `, [productId]);
        return unitPrice;
    } catch (error) {
        console.error('error at getProductPrice in the utils db', error);
    }
}


async function addCartClick(date, cartId, clickId) {
    try {
        const { rows: [ click ]} = await client.query(`
                UPDATE clicks
                SET cartclick = $1,
                carttime = $2,
                cartid = $3
                WHERE id = $4;
            `, [ true, date, cartId, clickId ]);
            return click;
    } catch (error) {
        console.error('error at addCartClick in utils db', error);
    }
}

async function addRemoveCartClick(date, clickId) {
    try {
        const click = await client.query(`
            UPDATE clicks
            set removecart = $1,
            removetime = $2
            WHERE id = $3;
        `, [true, date, clickId]);
    return click;
    } catch (error) {
        console.error('error at addRemoveCartClick in utils db', error);
    }
}

async function removeProductFromCartInUtils(cartId, productId, userId) {
    try {
        const { rows: [ { jointId: productsCartsId }]} = await client.query(`
                        SELECT "jointId"
                        FROM products_carts
                        WHERE "cartId" = $1
                        AND "productId" = $2; 
                    `, [ cartId, productId]);
                    //remove from cart
                    
                    await removeProductFromCart({ userId, cartId, products_cartsId: productsCartsId});
        return {message: 'removal done'};
    } catch (error) {
        console.error('error at removeProductFromCartInUtils at utils db', error);
    }
}

async function setCartClicksToBuy(date, cartId) {
    try {
        await client.query(`
                    UPDATE clicks
                    set buyclick = $1,
                    buytime = $2
                    WHERE cartid = $3;
                `, [true, date, cartId]);
        return {message: 'done!'};
    } catch (error) {
        console.error('error at the setCartClicksToBuy at utils db', error);
    }
}

async function getUserCount() {
    try {
        const { rows: [ {count }] } = await client.query(`
            SELECT count(*) FROM users;
        `);
        console.log('user count', count);
        return count;
    } catch (error) {
        console.error('error getting user size', error);
    }
}

async function getProductsCount() {
    try {
        const { rows: [ {count }] } = await client.query(`
            SELECT count(*) FROM products;
        `);
        return count;
    } catch (error) {
        console.error('error getting products size', error);
    }
}


async function seedClicks(numberOfSessions) {
    try {
        const array = [];
        for (let i = 0; i < numberOfSessions; i++) {
            array.push(i);
        }
        await Promise.each(array, async () => {
            try {
                await userSession(numberOfSessions);
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

function timeDelta() {
    return Math.floor(Math.random() * maxTimeDelta);
}

module.exports = { 
    seedClicks 
};