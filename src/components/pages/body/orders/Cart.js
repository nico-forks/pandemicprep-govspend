/** @format */

import React, { useState } from 'react';
import { Stripe } from '../orders/Stripe';
import { Button, Container, Col, Row, InputGroup, FormControl } from 'react-bootstrap';

import './Cart.css';

import {
	addNewCart,
	removeProductFromCart,
	patchCartItemQuantity,
	deactivateCart,
} from '../../../../api';
// import { Product } from '../products/Product';
import { removeProductFromGuestCart } from '../../../utils';

export const Cart = ({
	cart,
	setCart,
	cartSize,
	setCartSize,
	user,
	setView,
	useHistory,
	profileCompleted,
}) => {
	const history = useHistory();
	const [shipping, setShipping] = useState(5);

	const removeHandler = (product) => {
		const productId = product.id;
		if (user.firstName !== 'Guest') {
			removeProductFromCart(
				{ cartId: cart.id, products_cartsId: product.jointId },
				user.token,
			)
				.then((response) => {
					setCart(response);
					setCartSize(response.cartQuantity);
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			removeProductFromGuestCart(cart, product).then((result) => {
				setCart(result);
				setCartSize(result.cartQuantity);
				localStorage.setItem('panprepCart', JSON.stringify(result));
			});
		}
	};

	const ticker = (product, direction) => {
		const { jointId, id: productId, quantity, unitPrice } = product;
		if (quantity + direction > 0) {
			if (user.firstName !== 'Guest') {
				patchCartItemQuantity(
					{
						userId: user.id,
						jointId: jointId,
						quantity: quantity + direction,
						unitPrice: unitPrice,
					},
					user.token,
				)
					.then((result) => {
						setCart(result);
						setCartSize(result.cartQuantity);
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				const newCart = { ...cart };
				let newQuantity = 0;
				let newTotal = 0;
				newCart.items.map((item) => {
					if (item.id === productId) {
						item.quantity = item.quantity + direction;
						item.itemTotal = item.price * item.quantity;
					}
					newQuantity = newQuantity + item.quantity;
					newTotal = newTotal + parseFloat(item.itemTotal);
				});

				newCart.cartQuantity = newQuantity;
				newCart.total = newTotal;
				setCart(newCart);
				setCartSize(newQuantity);
				localStorage.setItem('panprepCart', JSON.stringify(newCart));
			}
		} else {
			if (user.firstName !== 'Guest') {
				removeProductFromCart(
					{ cartId: cart.id, products_cartsId: product.jointId },
					user.token,
				)
					.then((response) => {
						setCart(response);
						setCartSize(response.cartQuantity);
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				removeProductFromGuestCart(cart, product).then((result) => {
					setCart(result);
					setCartSize(result.quantity);
					localStorage.setItem('panprepCart', JSON.stringify(result));
				});
			}
		}
	};

	const checkoutHandler = () => {
		setView('userCheckout');
		history.push('/checkout');
	};

	const guestCheckout = () => {
		setView('guest');
		history.push('/checkout');
	};

	const newUserCheckout = () => {
		setView('checkout-register');
		history.push('/checkout');
	};

	return (
		<div id='cart-component'>
			{cart.cartQuantity > 0 ? (
				<h1>{user.firstName !== 'Guest' ? user.firstName + "'s" : ''} Cart</h1>
			) : (
				<h1>Empty Cart</h1>
			)}
			<div id='tables-outer-container'>
				<div id='cart-container'>
					{cart.cartQuantity > 0 ? (
						<Container id='cart-titles'>
							<Row>
								<Col xs={1} ></Col>
								<Col xs={3} className='cart-title'>Product</Col>
								<Col xs={3} className='cart-title'>Quantity</Col>
								<Col xs={2} className='cart-title'>Price</Col>
								<Col xs={2} className='cart-title'>Total</Col>
								<Col xs={1} ></Col>
							</Row>
						</Container>
					) : (
						<div></div>
					)}
					<div className='cart-grid'>
						{cart.items.length > 0
							? cart.items.map((product, i) => {
									return (
										<Container key={i} id='cart-row-container'>
											<Row>
												<Col xs={1} >
													<img
														className='cart-image'
														src={process.env.PUBLIC_URL + product.image}
													/>
												</Col>
												<Col xs={3} className='cart-field cart-product-title'>
													{product.title}
												</Col>
												<Col xs={3} >
													<InputGroup id='quantity-group'>
														<FormControl
															id='quantity-field'
															placeholder={product.quantity}
															aria-label={product.quantity}
															aria-describedby='basic-addon2'
														/>
														<InputGroup.Append id='quantity-buttons' > 
															<Button variant='outline-secondary' onClick={() => {
																	ticker(product, 1);
																}}>
																&#11014;
															</Button>
															<Button variant='outline-secondary' onClick={() => {
																	ticker(product, -1);
																}}>
																&#11015;
															</Button>
														</InputGroup.Append>
													</InputGroup>
													
												</Col>
												<Col xs={2} className='cart-field cart-product-price'>
													${' '}
													{product.unitPrice.toLocaleString('en-US', {
														minimumFractionDigits: 2,
													})}
												</Col>
												<Col xs={2} className='cart-field cart-product-total'>
													${' '}
													{product.itemTotal.toLocaleString('en-US', {
														minimumFractionDigits: 2,
													})}
												</Col>
												<Col xs={1} >
													<Button
														variant='dark'
														className='cart-delete'
														onClick={() => {
															removeHandler(product);
														}}
													>
														remove
													</Button>
												</Col>
											</Row>
										</Container>
									);
							  })
							: ''}
					</div>
				</div>
				<div id='total-outer-container'>
					<div id='total-container'>
						<span className='total-title total'>Cart Summary</span>
						<span className='total-label total'>Sub-Total:</span>
						<span className='total-amount total'>
							${' '}
							{parseFloat(cart.total).toLocaleString('en-US', {
								minimumFractionDigits: 2,
							})}
						</span>
						<span className='total-label total'>Shipping:</span>
						<span className='total-shipping total'>
							${' '}
							{parseFloat(cart.total) > 0
								? shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })
								: '0.00'}
						</span>
						<span className='total-label total'>Total:</span>
						<span className='total-total total'>
							${' '}
							{parseFloat(cart.total) > 0
								? (parseFloat(cart.total) + shipping).toLocaleString('en-US', {
										minimumFractionDigits: 2,
								  })
								: '0.00'}
						</span>
					</div>
					{user.isUser && !profileCompleted ? (
						<Button
							variant='dark'
							id='check'
							className='checkout-button'
							onClick={checkoutHandler}
						>
							Checkout
						</Button>
					) : !user.isUser && !profileCompleted ? (
						<div className='options'>
							<Button
								variant='dark'
								className='checkout-guest asguest'
								onClick={guestCheckout}
							>
								As a guest
							</Button>
							<Button
								variant='dark'
								className='checkout-guest asuser'
								onClick={newUserCheckout}
							>
								Create Account
							</Button>
						</div>
					) : (
						<Stripe className='stripe-button' />
					)}
				</div>
			</div>
		</div>
	);
};
