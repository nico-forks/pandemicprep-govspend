/** @format */

import React, { useState, useEffect } from 'react';
import Slider from 'react-animated-slider';
import { Carousel } from 'react-bootstrap';

import './Promoted.css';
import 'react-animated-slider/build/horizontal.css';

import { getPromotedProducts, getProductById } from '../../../../api/products';

export const Promoted = ({ NavLink, setProduct, useHistory }) => {
	const [content, setContent] = useState([]);
	const history = useHistory();

	useEffect(() => {
		getPromotedProducts()
			.then((response) => {
				setContent(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const fetchPromotedProduct = (item, index) => {
		getProductById(item.id)
			.then((response) => {
				setProduct(response);
				history.push('/product');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div id='flexwrapper'>
			<div className='wrapper'>
				<h1>Featured Products</h1>
			</div>

			<Carousel className='carousel' indicators={false} >
				{content.map((item, index) => (
					<Carousel.Item
						key={index}
						className='carousel-item'
						interval={1000}
						
						onClick={() => {
							fetchPromotedProduct(item, index);
						}}
					>
						<div className='image-container'>
							<img className="d-block" src={item.image} />
						
						<Carousel.Caption className='carousel-captions'>
							<div className='carousel-text'>
								<h3>{item.title}</h3>
								<p>${' '}
									{item.price.toLocaleString('en-US', {
										minimumFractionDigits: 2,
									})}</p>
							</div>
						</Carousel.Caption>
						</div>
					</Carousel.Item>
				))}
			</Carousel>
		</div>
	);
};
