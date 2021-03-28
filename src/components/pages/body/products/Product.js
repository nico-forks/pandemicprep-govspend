/** @format */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import './Product.css';

import { addProductToCart, patchCartItemQuantity } from '../../../../api/cart';
import { addProductToGuestCart } from '../../../index';

export const Product = ({ product, setCart, cart, user, setCartSize }) => {
	
	
	const history = useHistory();
	if (!('id' in product)) {
		history.push('/');
	}

	const addToCartHandler = () => {
		const alreadyPresent = cart.items.find((item) => {
			return item.id === product.id;
		});
		

		if (user.isUser) {
			if (!alreadyPresent) {
				addProductToCart(
					{
						userId: user.id,
						productId: product.id,
						cartId: cart.id,
						quantity: 1,
						unitPrice: parseFloat(product.price),
					},
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
				patchCartItemQuantity(
					{
						userId: user.id,
						jointId: alreadyPresent.jointId,
						quantity: alreadyPresent.quantity + 1,
						unitPrice: alreadyPresent.unitPrice,
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
			}
		} else {
			addProductToGuestCart(cart, product).then((result) => {
				setCart(result);
				setCartSize(result.cartQuantity);
			});
		}
	};

	return (
		<>
			<div key={product.id} className='product1'>
				<img className='image' src={process.env.PUBLIC_URL + product.image}></img>
				<div className='info'>
					<p className='header'>{product.title}</p>
					<p className='description1'>{product.description}</p>
					<p className='price'>
						${' '}
						{parseFloat(product.price).toLocaleString('en-US', {
							minimumFractionDigits: 2,
						})}
					</p>
					<Button id='addToCart' onClick={addToCartHandler}>
						Add to Cart
					</Button>
				</div>
			</div>
		</>
	);
};
