// /** @format */

// import React from 'react';

// // import { Stripe } from '../../../index';
// import './Payment.css';

// export const Payment = ({ cart }) => {
// 	const shipping = 5.0;

// 	return (
// 		<div className='payment'>
// 			<Stripe className='stripe-component' />
// 			<div id='total-outer-container'>
// 				<div id='total-container'>
// 					<span className='total-title total'>Cart Summary</span>
// 					<span className='total-label total'>Sub-Total:</span>
// 					<span className='total-amount total'>
// 						${' '}
// 						{parseFloat(cart.total).toLocaleString('en-US', {
// 							minimumFractionDigits: 2,
// 						})}
// 					</span>
// 					<span className='total-label total'>Shipping:</span>
// 					<span className='total-shipping total'>
// 						${' '}
// 						{parseFloat(cart.total) > 0
// 							? shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })
// 							: '0.00'}
// 					</span>
// 					<span className='total-label total'>Total:</span>
// 					<span className='total-total total'>
// 						${' '}
// 						{parseFloat(cart.total) > 0
// 							? (parseFloat(cart.total) + shipping).toLocaleString('en-US', {
// 									minimumFractionDigits: 2,
// 							})
// 							: '0.00'}
// 					</span>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
