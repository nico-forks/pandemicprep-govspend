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
        INSERT INTO clicks (viewclick, viewtime, productid, userid)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,
			[true, time, productId, userId],
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
async function addCartClick(clickId, productId, userId) {
    try {
        const date = new Date();
        const firstClick = await getClick(clickId);
        if (firstClick.productid === productId && firstClick.userid === userId) {
            const { rows: [ cartClick ]} = await client.query(`
                UPDATE clicks
                SET cartclick = ${true},
                carttime = $1
                WHERE id = $2
                RETURNING *;
            `, [ date, clickId ]);
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


module.exports = {
	addViewClick, 
    addCartClick,
    addBuyClick
};
