const { client } = require('../client');
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
        }, {
            type: 'node',
            name: 'dates',
            logic: 'AND',
            query: 'cart.date'
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

// where ((cat1 or cat2) and (prod1 or prod2)) and (dateRange) and  ((genderA or genderB) and (age1 or age2) and (city1 or city2) and (zipcode1 or zipcode2))



/**
 * 
 * @param {Object} query can be null or have any of the following properties: categories, product, dates, username, gender, age, city, zipcode
 * each property will have an array of values. For example {categories: ['camping']}.
 * Age will have an array of objects {age: [{from: 20, to: 35}]}
 * An example input could be: {categories: ['food', 'house'], date: [{from: '2019-10-15', to: '2019-12-31}], age: [{from: '1900-01-01', to: '2200-01-01'}], city: ['Jacksonville']}
 * returns {Array} an array of rows that fulfill the query
 */
async function salesQuery(incomingQuery = {}) {
    try {
        joinOr();
        let finalQuery = '';
        let values = [];

        let categoriesFlag = incomingQuery.hasOwnProperty('category');
        // if (incomingQuery.category.length === 0) categoriesFlag = false;
        let productsFlag = incomingQuery.hasOwnProperty('product');
        let catGroupFlag = categoriesFlag || productsFlag;

        let datesFlag = incomingQuery.hasOwnProperty('date');
        // if (datesFlag) {
        //     _.forEach(incomingQuery.date, item => {
        //         item.from = item.from + ' 00:00';
        //         item.to = item.to + ' 00:00';
        //     })
        // }
        let datesGroupFlag = datesFlag;
    
        
        let genderFlag = incomingQuery.hasOwnProperty('gender');
        let ageFlag = incomingQuery.hasOwnProperty('age');
        // if (incomingQuery.age.length === 0) ageFlag = false;
        let cityFlag = incomingQuery.hasOwnProperty('city');
        let zipcodeFlag = incomingQuery.hasOwnProperty('zipcode');
        let userGroupFlag = genderFlag || ageFlag || cityFlag || zipcodeFlag;
        
        let categoriesQuery = joinOr(false, incomingQuery, 'category', values);
        let productsQuery = joinOr(false, incomingQuery, 'product', values);

        let datesQuery = joinOr(false, incomingQuery, 'date', values);

        let genderQuery = joinOr(false, incomingQuery, 'gender', values);
        let ageQuery = joinOr(false, incomingQuery, 'age', values);
        let cityQuery = joinOr(false, incomingQuery, 'city', values);
        let zipcodeQuery = joinOr(false, incomingQuery, 'zipcode', values);
        
        let queryArray = [];
        let catArray = [];
        if (categoriesFlag) catArray.push(categoriesQuery);
        if (productsFlag) catArray.push(productsQuery);
        if (catGroupFlag) queryArray.push(catArray);

        let datesArray = [];
        if (datesFlag) datesArray.push(datesQuery);
        if (datesGroupFlag) queryArray.push(datesArray);

        let usersArray = [];
        
        if (genderFlag) usersArray.push(genderQuery);
        if (ageFlag) usersArray.push(ageQuery);
        if (cityFlag) usersArray.push(cityQuery);
        if (zipcodeFlag) usersArray.push(zipcodeQuery);
        if (userGroupFlag) queryArray.push(usersArray);
        
        if (catGroupFlag || datesGroupFlag || userGroupFlag) {
            finalQuery = 
            `WHERE (${
                _.join(queryArray.map(subArray => {
                return `(${_.join(subArray, ' AND ')})`;
            }), ' AND ')})`;
        }
        
        console.log('final query', finalQuery);
        console.log('values', values)

        const { rows } = await client.query(`
            SELECT products.title, SUM(products_carts."quantity") AS quantity, SUM(products_carts."itemTotal") AS sale, 
            SUM(products.cost * products_carts.quantity) AS cost
            FROM products 
            JOIN products_carts ON products.id = products_carts."productId"
            JOIN carts ON products_carts."cartId" = carts.id
            JOIN users ON carts."userId" = users.id
            JOIN products_categories ON products.id = products_categories."productId"
            ${finalQuery}
            GROUP BY products.title
            ORDER BY Sale DESC;             
        `, values);
        
        return rows;
    } catch (error) {
        console.error('error with master sales query', error);
    }
}

const joiner = () => {
    let counter = 1;

    const joinThem =  (reset = true, object = {}, property = null, values = null) => {
        if (reset) {
            counter = 1;
        } else {
            if (property === 'age' || property === 'date') {
                _.forEach(object[property], item => {
                    values.push(item.from);
                    values.push(item.to);
                });
            } else if (property === 'zipcode' || property === 'city') {
                if (object.hasOwnProperty(property)) {
                    const separatedValues = _.split(object[property], ', ');
                    _.forEach(separatedValues, item => values.push(item));
                }
            } else {
                _.forEach(object[property], item => {
                    values.push(item);
                });
            }
            
            return object.hasOwnProperty(property) ? `(${_.join(_.map(object[property], item => {
                let returnString = tableName(property, counter);
                if (property === 'age' || property === 'date' || property === 'zipcode') {
                    counter += 2;
                } else if (property === 'city') {
                    counter += 3;
                } else {
                    counter++;
                }
                return returnString;
            } ), ' OR ')})` : '';
        }
        
        
    }
    return joinThem;
}

const joinOr = joiner();

function tableName(property, counter) {
    switch (property) {
        case 'category':
            return `products_categories."categoryId" = $${counter}`;
        case 'product':
            return `products.id = $${counter}`;
        case 'gender':
            return `users.gender = $${counter}`;
        case 'age':
            return `(users.birthdate BETWEEN $${counter} AND $${counter + 1})`;
        case 'city':
            return `users.city = $${counter} AND users.state = $${counter + 1} AND users.country = $${counter + 2}`;
        case 'zipcode':
            return `users.zipcode = $${counter} AND users.country = $${counter + 1}`;
        case 'date':
            return `(carts.timestamp BETWEEN $${counter} AND $${counter + 1})`;
        default:
            return '';
    }
}

async function testTimestamp(date) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM carts
            WHERE timestamp BETWEEN $1 AND $2;

        `, [ date, '2021-11-01' ]);
        console.log(rows);
    } catch (error) {
        console.error('error with my test', error);
    }
} 

module.exports = { salesQuery, testTimestamp };

