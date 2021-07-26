const { client } = require('./client');
const Promise = require('bluebird');
const _ = require('lodash');

//This will be where the click data will be queried
/*
How many:
views period
views go to cart
carts get cancelled
carts become buy

where:
user demographics (who) is clicking to view
clicking to cart, clicking to buy

what:
product gets more views
product gets more carts
product gets more buys
product has greatest ratio view to buy

*/


/**
 * 
 * @param {Object} query can be null or have any of the following properties: categories, product, username, gender, age, city, zipcode
 * each property will have an array of values. For example {categories: ['camping']}.
 * Age will have an array of objects {age: [{from: 20, to: 35}]}
 * An example input could be: {categories: ['food', 'house'], age: [{from: 20, to: 35}, {from: 35, to: 50}], city: ['Jacksonville']}
 * returns {Array} an array of rows that fulfill the query
 */
async function analyticsQuery(incomingQuery = {}) {
    try {

        
    } catch (error) {
        console.error('error with master analytics query', error);
    }
}



module.exports = { analyticsQuery }

