const { client } = require('./client');
const Promise = require('bluebird');
const _ = require('lodash');


//the logic applies to the siblings. So if the logic is and it means that the siblings are 'and'. From parent to child is always 'and'
//repeated iterations of the same node/leaf are always OR. For example selecting two categories, or two products, or two cities.
let tree = {

    type: 'root',
    name: 'sales',
    logic: 'WHERE',
    children: [
        {
            type: 'node',
            name: 'categories',
            logic: 'AND',
            query: 'categories.id',
            children: [
                {
                    
                        type: 'leaf',
                        name: 'product',
                        logic: 'AND',
                        query: 'product.id = $3'
                        
                    
                }
            ]
        },
        {
            type: 'node',
            name: 'users',
            logic: 'AND',
            children: [
                {
                    type: 'leaf',
                    name: 'username',
                    logic: 'AND',
                    query: 'users."userName" = $5'
                },
                {
                    type: 'leaf',
                    name: 'gender',
                    logic: 'AND',
                    query: 'users.gender = $6'
                }, {
                    type: 'leaf',
                    name: 'age-range',
                    logic: 'AND',
                    query: 'users.birthdate = $7'
                }, {
                    type: 'leaf',
                    name: 'city',
                    logic: 'AND',
                    query: 'users.city = $8'
                }, {
                    type: 'leaf',
                    name: 'zipcode',
                    logic: 'AND',
                    query: 'users.zipcode = $9'
                }
            ]
        }
    ],

}

// where ((cat1 or cat2) and (prod1 or prod2)) and ((username1 or username2) AND (genderA or genderB) and (age1 or age2) and (city1 or city2) and (zipcode1 or zipcode2))



/**
 * 
 * @param {Object} query can be null or have any of the following properties: categories, product, username, gender, age, city, zipcode
 * each property will have an array of values. For example {categories: ['camping']}.
 * Age will have an array of objects {age: [{from: 20, to: 35}]}
 * An example input could be: {categories: ['food', 'house'], age: [{from: 20, to: 35}, {from: 35, to: 50}], city: ['Jacksonville']}
 * returns {Array} an array of rows that fulfill the query
 */
async function salesQuery(incomingQuery = {}) {
    try {

        let finalQuery = '';
        let values = [];

        let categoriesFlag = incomingQuery.hasOwnProperty('category');
        let productsFlag = incomingQuery.hasOwnProperty('product');
        let catGroupFlag = categoriesFlag || productsFlag;
    
        let usernameFlag = incomingQuery.hasOwnProperty('username');
        let genderFlag = incomingQuery.hasOwnProperty('gender');
        let ageFlag = incomingQuery.hasOwnProperty('age');
        let cityFlag = incomingQuery.hasOwnProperty('city');
        let zipcodeFlag = incomingQuery.hasOwnProperty('zipcode');
        let userGroupFlag = usernameFlag || genderFlag || ageFlag || cityFlag || zipcodeFlag;
        
        let categoriesQuery = joinOr(incomingQuery, 'category', values);
        let productsQuery = joinOr(incomingQuery, 'product', values);

        let usernameQuery = joinOr(incomingQuery, 'username', values);
        let genderQuery = joinOr(incomingQuery, 'gender', values);
        let ageQuery = joinOr(incomingQuery, 'age', values);
        let cityQuery = joinOr(incomingQuery, 'city', values);
        let zipcodeQuery = joinOr(incomingQuery, 'zipcode', values);
        
        let queryArray = [];
        let catArray = [];
        if (categoriesFlag) catArray.push(categoriesQuery);
        if (productsFlag) catArray.push(productsQuery);
        if (catGroupFlag) queryArray.push(catArray);

        let usersArray = [];
        if (usernameFlag) usersArray.push(usernameQuery);
        if (genderFlag) usersArray.push(genderQuery);
        if (ageFlag) usersArray.push(ageQuery);
        if (cityFlag) usersArray.push(cityQuery);
        if (zipcodeFlag) usersArray.push(zipcodeQuery);
        if (userGroupFlag) queryArray.push(usersArray);
        
        if (catGroupFlag || userGroupFlag) {
            finalQuery = 
            `WHERE (${
                _.join(queryArray.map(category => {
                return `(${_.join(category, ' AND ')})`;
            }), ' AND ')})`;
        }
        
        console.log(finalQuery);
        const { rows } = await client.query(`
            SELECT products.title, SUM(products_carts."itemTotal") AS Sale, SUM(products.cost * products_carts.quantity) AS Cost
            FROM products 
            JOIN products_carts ON products.id = products_carts."productId"
            JOIN carts ON products_carts."cartId" = carts.id
            JOIN users ON carts."userId" = users.id
            JOIN products_categories ON products.id = products_categories."productId"
            ${finalQuery}
            GROUP BY products.title;             
        `, values);
        console.log(rows);
    } catch (error) {
        console.error('error with master sales query', error);
    }
}

const joiner = () => {
    let counter = 1;

    return (object, property, values) => {
        
    if (property === 'age') {
        _.forEach(object[property], item => {
            values.push(item.from);
            values.push(item.to);
        });
    } else {
        _.forEach(object[property], item => {
            values.push(item);
        });
    }
    
    return object.hasOwnProperty(property) ? `(${_.join(_.map(object[property], item => {
        let returnString = tableName(property, counter);
        if (property === 'age') {
            counter += 2;
        } else {
            counter++;
        }
        return returnString;
    } ), ' OR ')})` : '';
}
}

const joinOr = joiner();

function tableName(property, counter) {
    switch (property) {
        case 'category':
            return `products_categories."categoryId" = $${counter}`;
        case 'product':
            return `products.id = $${counter}`;
        case 'username':
            return `users.id = $${counter}`;
        case 'gender':
            return `users.gender = $${counter}`;
        case 'age':
            return `(users.birthdate >= $${counter} AND users.birthdate <= $${counter + 1})`;
        case 'city':
            return `users.city = $${counter}`;
        case 'zipcode':
            return `users.zipcode = $${counter}`;
        default:
            return '';
    }
}


module.exports = { salesQuery }

