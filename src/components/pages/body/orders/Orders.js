/** @format */

import React, { useState, useEffect } from 'react';

import './Orders.css';

import { getOrderHistory } from '../../../../api';

export const Orders = ({ user }) => {
	const [orderHistory, setOrderHistory] = useState([]);
	const orderPage = 1;
	// const [orderPageLimit, setOrderPageLimit] = useState(0);
	const [clickedIndex, setClickedIndex] = useState(-1);

	useEffect(() => {
		getOrderHistory(orderPage, user.token)
			.then((response) => {
				// setOrderPageLimit(response[0]);
				setOrderHistory(response[1]);
			})
			.catch((error) => {
				console.error(error);
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderPage]);

	const toggleDetails = (index) => {
		if (clickedIndex === index) {
			setClickedIndex(-1);
		} else {
			setClickedIndex(index);
		}
	};

	return (
		<div className='orders'>
			<h1 className='orders-h1'>Order History</h1>

			<div className='orders-list'>
				{orderHistory.map((order, index) => {
					if (order.status === 'active') {
						return '';
					} else {
						return (
							<div
								key={index}
								className='first-map-div'
								onClick={() => toggleDetails(index)}
							>
								<div className='history-top'>
									<p className='hist-tit'>Date Placed</p>

									<p className='hist-tit'>Number Of Items</p>

									<p className='hist-tit'>Order Total</p>

									<p className='hist-tit'>Status</p>
									<span id='clickMe'>Click to Expand</span>
									<p className='hist-con'>{order.date}</p>

									<p className='hist-con'>{order.cartQuantity}</p>

									<p className='hist-con'>
										${' '}
										{order.total.toLocaleString('en-US', {
											minimumFractionDigits: 2,
										})}
									</p>

									<p className='hist-con'>{order.status}</p>
								</div>

								{clickedIndex === index ? (
									<div className='hidden-details-cont '>
										<div className='hidden-titles'>
											<p className='hid-tit'>Product</p>

											<p className='hid-tit'>Quantity</p>

											<p className='hid-tit'>Price</p>

											<p className='hid-tit'>Total</p>
										</div>

										<div className='hidden-item-cont'>
											{order.items.map((item, i) => {
												return (
													<div key={i} className='each-hidden-item'>
														<p className='hid-con'>{item.title}</p>
														<p className='hid-con'>{item.quantity}</p>
														<p className='hid-con'>
															${' '}
															{item.price.toLocaleString('en-US', {
																minimumFractionDigits: 2,
															})}
														</p>
														<p className='hid-con'>
															${' '}
															{(
																item.price * item.quantity
															).toLocaleString('en-US', {
																minimumFractionDigits: 2,
															})}
														</p>
													</div>
												);
											})}
										</div>
									</div>
								) : (
									''
								)}
							</div>
						);
					}
				})}
			</div>
		</div>
	);
};
