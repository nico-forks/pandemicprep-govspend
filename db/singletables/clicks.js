/** @format */

const { client } = require('../client');
// const { getTimestamp } = require('../utils/utils');
// const Promise = require('bluebird');
// const LIMIT = 20;

/**
 * 
 * @param {Integer} productId 
 * @param {Integer} userId 
 * @returns {Object} a click object {id, viewclick, viewtime, cartclick, carttime, buyclic, buytime, productid, userid}
 * or { message } in the case of failure.
 */
async function addViewClick(productId, userId) {
    try {
        
        const time = new Date();
        const {
			rows: [ click ],
		} = await client.query(
			`
        INSERT INTO clicks (viewclick, viewtime, productid, userid, cartid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `,
			[true, time, productId, userId, null],
		);
		
		if (click) return click;
        return { message: 'error trying to add a click'}
    } catch (error) {
        console.error('addViewClick', error);
    }
}

/**
 * 
 * @param {Integer} clickId 
 * @returns {Object} a click object {id, viewclick, viewtime, cartclick, carttime, buyclic, buytime, productid, userid}
 * or a {message} in the case of failure.
 */
async function getClick(clickId) {
    try {
        const { rows: [ click ]} = await client.query(`
            SELECT * FROM clicks
            WHERE id=$1;
        `, [ clickId ]);
        if (click) return click;
        return {message: 'error getting click'};
    } catch (error) {
        console.error('error with getClick()', error);
    }
}

/**
 * 
 * @param {Integer} clickId 
 * @param {Integer} productId 
 * @param {Integer} userId 
 * @returns {object} a click object {id, viewclick, viewtime, cartclick, carttime, buyclic, buytime, productid, userid}
 * or a {message} in the case of failure.
 */
async function addCartClick(clickId, productId, userId, cartId) {
    try {
        const date = new Date();
        const firstClick = await getClick(clickId);
        if (firstClick.productid === productId && firstClick.userid === userId) {
            const { rows: [ cartClick ]} = await client.query(`
                UPDATE clicks
                SET cartclick = ${true},
                carttime = $1,
                cartid = $2
                WHERE id = $3
                RETURNING *;
            `, [ date, cartId, clickId ]);
            return cartClick;
        }
        return { message: 'error adding a cart click'}
    } catch (error) {
        console.error('error with addCartClick()', error);
    }
}

/**
 * 
 * @param {Integer} clickId 
 * @param {Integer} productId 
 * @param {Integer} userId 
 * @returns a click object {id, viewclick, viewtime, cartclick, carttime, buyclic, buytime, productid, userid}
 * or a {message} in the case of failure.
 */
async function addBuyClick(clickId, productId, userId) {
    try {
        const date = new Date();
        const firstClick = await getClick(clickId);
        if (firstClick.cartclick && firstClick.productid === productId && firstClick.userid === userId) {
            const { rows: [ buyClick ]} = await client.query(`
                UPDATE clicks
                SET buyclick = ${true},
                buytime = $1
                WHERE id = $2
                RETURNING *;
            `, [ date, clickId ]);
            return buyClick;
        }
        return { message: 'error adding a buy click'}
    } catch (error) {
        console.error('error with addBuyClick()', error);
    }
}

async function removeFromCart(clickId, productId, userId) {
    try {
        
        const date = new Date();
        const firstClick = await getClick(clickId);
        if (firstClick.cartclick && firstClick.productid === productId && firstClick.userid === userId) {
            const { rows: [ removeCart ]} = await client.query(`
                UPDATE clicks
                SET removecart = ${true},
                removetime = $1
                WHERE id = $2
                RETURNING *;
            `, [ date, clickId ]);
            return removeCart;
        }
        return { message: 'error removing a cart click'}
    } catch (error) {
        console.error('error with removeFromCart()', error);
    }
}

async function getUserClicks(userId) {
    try {
        
            const { rows: data } = await client.query(`
                SELECT * 
                FROM clicks
                WHERE userid = $1 AND
                cartclick = $2 AND
                removecart = $3 AND
                buyclick = $4;
            `, [ userId, true, false, false ]);
            console.log('userid', userId, 'data', data);
            if (data) return data;
            return [];
        
    } catch (error) {
        console.error('error with getUserClicks()', error);
    }
}

module.exports = {
	addViewClick, 
    addCartClick,
    addBuyClick,
    removeFromCart,
    getUserClicks
};
