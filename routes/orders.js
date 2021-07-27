const express = require('express');
const ordersRouter = express.Router();
// const stripe = require('stripe')('sk_test_51HbAonE4JzAJB7t2idVGZHl8r5tInb2TseIYxrPXXR37hePbl8MEt2aZsLmBmAiNUWmq1aBn8XAPkQLu6suKNbDj00CleQPnYb');

const {
    addCart,
    getUserOrderHistory
} = require('../db/singletables/cart');

// Gets carts of all status for a particular user
ordersRouter.get('/:pageNumber', async (req, res, next) => {
    try {
        const {pageNumber} = req.params;
        if (req.user) {
            const orderHistory = await getUserOrderHistory(req.user.id, pageNumber);
            res.send(orderHistory)
        } else {
            res.send({message: 'Must be correct user to retrieve this order history!'})
        }
    } catch (error) {
        next(error);
    }
})

//Creates new cart
ordersRouter.post('/', async (req, res, next) => {
    try {
        const cart = req.body;
        const newCart = await addCart(cart);

        res.send(newCart);
    } catch (error) {
        next(error);
    }
});

// ordersRouter.post('/create-checkout-session', async (req, res) => {
   
//   const {cart} = req.body
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'Total',
//             },
//             unit_amount: parseInt((cart.total * 100) + 500),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/',
//     });
  
//     res.send({ id: session.id, session: session});
    
//   });

module.exports = ordersRouter;


// price: {
//   'id': 1,
//   'object': "price",
//   'active': true,
//   'billing_scheme': 'per_unit',
//   'created': 1599082103,
//   'currency': 'usd',
//   'livemode': false,
//   'lookup_key': null,
//   'metadata': {},
//   'nickname': null,
//   'product': 'pencils',
//   'recurring': null,
//   'tiers_mode': null,
//   'transform_quantity': null,
//   'type': 'one_time',
//   'unit_amount': 9,
//   'unit_amount_decimal': 99
// },