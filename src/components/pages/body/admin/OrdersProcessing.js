/** @format */

import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
// import users from '../../../../../db/singletables/users';

import './OrdersProcessing.css';

import { getAllProcessing, completeOrder } from '../../../../api';

export const OrdersProcessing = ({ user }) => {
	const [orders, setOrders] = useState([]);
	const [processingPage, setProcessingPage] = useState(1);
	const [processingPageLimit, setProcessingPageLimit] = useState(0);
	const [clickedIndex, setClickedIndex] = useState(-1);
	const [finalized, setFinalized] = useState(true);

	useEffect(() => {
		getAllProcessing(processingPage, user.token)
			.then((response) => {
				setProcessingPageLimit(response[0]);
				setOrders(response[1]);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [processingPage, finalized]);

	const toggleDetails = (event, index) => {
		if (event.target.value !== 'complete-button') {
			console.log('event value ', event.target.value);
			if (clickedIndex === index) {
				setClickedIndex(-1);
			} else {
				setClickedIndex(index);
			}
		}
	};

	const finalizeOrder = async (order) => {
		try {
			await completeOrder(order.id, user.token);
		} catch (error) {
			throw error;
		}
		setFinalized(!finalized);
	};

	// Pagination handlers
	const firstHandler = () => {
		if (processingPage > 1) {
			setProcessingPage(1);
		}
	};
	const prevHandler = () => {
		if (processingPage > 1) {
			setProcessingPage(processingPage - 1);
		}
	};
	const nextHandler = () => {
		if (processingPage < processingPageLimit) {
			setProcessingPage(processingPage + 1);
		}
	};
	const lastHandler = () => {
		if (processingPage < processingPageLimit) {
			setProcessingPage(processingPageLimit);
		}
	};

	return (
		<div id='all-processing'>
			<div className='order-list'>
				<div id='initial-titles'>
					<p>Name</p>
					<p>Email</p>
					<p>Total $</p>
					<p>Date Placed</p>
				</div>

				{orders.length < 1 ? (
					<h1 id='empty-h1'>Currently no processing orders.</h1>
				) : (
					orders.map((order, index) => {
						return (
							<div
								key={index}
								className='order-content'
								onClick={(event) => toggleDetails(event, index)}
							>
								<div id='initial-details'>
									<p>
										{order.user.firstName} {order.user.lastName}
									</p>
									<p>{order.user.email}</p>
									<p>
										${' '}
										{order.total.toLocaleString('en-US', {
											minimumFractionDigits: 2,
										})}
									</p>
									<p>{order.date}</p>
									{/* <button
										id='dropdown-arrow'
										onClick={() => toggleDetails(index)}
									>
										ˇ
									</button> */}
									<button
										className='processing-button'
										value='complete-button'
										onClick={() => finalizeOrder(order)}
									>
										Complete Order
									</button>
								</div>

								{clickedIndex === index ? (
									<div className='hidden-details-orders'>
										<div id='hidden-titles'>
											<p>Product</p>
											<p>Quantity</p>
											<p>Price</p>
											<p>Total</p>
										</div>

										{order.items.map((item, i) => {
											return (
												<div key={i} id='each-hidden-item'>
													<p>{item.title}</p>
													<p>{item.quantity}</p>
													<p>
														${' '}
														{item.price.toLocaleString('en-US', {
															minimumFractionDigits: 2,
														})}
													</p>
													<p>
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
								) : (
									''
								)}
							</div>
						);
					})
				)}
			</div>
			<Pagination className='bootstrap-pagination'>
				{processingPage === 1 ? (
					''
				) : (
					<>
						<Pagination.First onClick={firstHandler}/>
						<Pagination.Prev onClick={prevHandler}/>
					</>
				)}
				<Pagination.Item>{processingPage}</Pagination.Item>
				{processingPage === processingPageLimit ? (
					''
				) : (
					<>
						<Pagination.Next onClick={nextHandler}/>
						<Pagination.Last onClick={lastHandler}/>
					</>
				)}

			</Pagination>
		</div>
	);
};
