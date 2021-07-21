
const { client } = require('../client');
const Promise = require('bluebird');
const { getActiveCart } = require('../singletables/cart');
const { flip } = require('lodash');

const userSize = 54;
const productSize = 231;
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
async function viewClick() {
    const userId = Math.floor(Math.random() * userSize);
    
    const initialDate = Math.floor(new Date(2020, 0).getTime());
    const finalDate = Math.floor(new Date(2021, 0).getTime());
    const dateEpoch = Math.floor((Math.random() * (finalDate - initialDate)) + initialDate);
    const date = new Date(dateEpoch);
    const numberOfActions = Math.floor((Math.random() * 40) + 1);
    const actionsArray = [];
    for (let i = 0; i < numberOfActions; i++) { actionsArray.push(i); }
    let getActiveCartId = 0;
    
    try {
        await Promise.each(actionsArray, async (action) => {
            try {
                const productId = Math.floor(Math.random() * productSize);
                const { rows: [ click ]} = await client.query(`
                    INSERT INTO clicks (viewclick, viewtime, productid, userid, cartid)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
        `, [true, date, productId, userId, null]);
            console.log(click);

            //now I have userId, productId, date, and click.
            //if flip coin is true then:
            //need to get cart. Empty it. Then add this click to cart.

            if (flipCoin()) {
                const { rows: [ cartId ]} = await client.query(`
                    SELECT id FROM carts
                    WHERE "userId" = $1
                    AND status = $2;
                `, [userId, 'active']);
                
                //Proceed to empty cart.
                await client.query(`
                    DELETE FROM products_carts
                    WHERE "cartId" = $1;
                `, [cartId]);

                //get product price
                const { rows: [productPrice ]} = await client.query(`
                    SELECT price FROM products
                    WHERE "productId" = $1;
                `, [productId]);

                //add this product to cart (products_carts)
                await client.query(`
                    INSERT INTO products_carts ("productId", "cartId", quantity, "unitPrice", "itemTotal" )
                    VALUES ($1, $2, $3, $4, $5);
                `, [ productId, cartId, 1, productPrice, productPrice ]);

                //now add cart click to this click
                await client.query(`
                    UPDATE clicks
                    SET 
                `);
            }



            //if flip coin is true, then remove from cart.
        
            //keep cart in memory. After all these are done, flip coin and see if buy all the cart or not. If buy act accordingly.
        
            } catch (error) {
                console.error('error within the bluebird Promise.map in utils', error);
            } 
        }); //end of Promise.each

    } catch (error) {
        console.error('error at the viewClick function in the utils folder', error);
    }


}


async function seedClicks() {
    try {
        await viewClick();
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