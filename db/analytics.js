const { client } = require('./client');
const Promise = require('bluebird');


//the logic applies to the siblings. So if the logic is and it means that the siblings are 'and'. From parent to child is always 'and'
//repeated iterations of the same node/leaf are always OR. For example selecting two categories, or two products, or two cities.
let tree = {

    type: 'root',
    name: 'sales',
    children: [
        {
            type: 'node',
            name: 'categories',
            logic: 'WHERE',
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
            logic: 'WHERE',
            children: [
                {
                    type: 'leaf',
                    name: 'gender',
                    logic: 'AND',
                    query: 'users.gender = $5'
                }, {
                    type: 'leaf',
                    name: 'age-range',
                    logic: 'AND',
                    query: 'users.birthdate = $6'
                }, {
                    type: 'leaf',
                    name: 'city',
                    logic: 'AND',
                    query: 'users.city = $7'
                }, {
                    type: 'leaf',
                    name: 'zipcode',
                    logic: 'AND',
                    query: 'users.zipcode = $8'
                }
            ]
        }
    ],

}


/**
 * 
 * @param {Object} query can be null or have any of the following properties: categories, product, gender, age, city, zipcode 
 * returns {Array} an array of rows that fulfill the query
 */
async function salesQuery(incomingQuery = {}) {
    try {
        let where = null;
        
        let entries = Object.entries(incomingQuery);
        
        let titles = ''; 
        let values = '';

        if (entries.length > 0) {

        }

        const { rows } = await client.query(`
            SELECT products.title, SUM(products_carts."itemTotal") AS Sale, SUM(products.cost * products_carts.quantity) AS Cost
            FROM products 
            JOIN products_carts ON products.id = products_carts."productId"
            JOIN carts ON products_carts."cartId" = carts.id
            JOIN users ON carts."userId" = users.id
            JOIN products_categories ON products.id = products_categories."productId"
            
            
            GROUP BY products.title; 

            
        `, [  ]);
        console.log(rows);
    } catch (error) {
        console.error('error with master query', error);
    }
}

// function titleString(title) {
//     switch (title) {
//         case 'category':
//             return 'categories.name';
//         case ''
//     }
// }




module.exports = { salesQuery }


/*

            
            SELECT products.title, SUM(products_carts."itemTotal") AS Sale, SUM(products.cost * products_carts.quantity) AS Cost
            FROM products 
            JOIN products_carts ON products.id = products_carts."productId"
            JOIN carts ON products_carts."cartId" = carts.id
            JOIN users ON carts."userId" = users.id
            JOIN products_categories ON products.id = products_categories."productId"
            JOIN clicks ON clicks.productid = products.id
            GROUP BY products.title; 

*/