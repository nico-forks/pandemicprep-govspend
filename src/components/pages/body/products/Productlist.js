/** @format */

import React, { useState } from 'react';

import './Productlist.css';
import '../MainBody.css';

export const Productlist = ({
	products,
	setProduct,
	NavLink,
	category,
	useHistory,
}) => {

	const history = useHistory();

	if (category === '') {
        history.push('/');
    }

	

	return (
		<div className='productList'>
			<div className='productContainer'>
				{products.map((singleProduct, i) => {
					if (singleProduct.isActive) {
						return (
							<NavLink
								id='productA'
								className='product-card'
								key={i}
								to='/product'
								onClick={(event) => {
									setProduct(singleProduct);
								}}
							>
								<div key={i} className='product'>
									<div id='product' className='info'>
										<p className='header'>{singleProduct.title}</p>
										<img
											className='image'
											src={process.env.PUBLIC_URL + singleProduct.image}
										/>
										<p className='description'>{singleProduct.description}</p>
										<p className='price'>
											${' '}
											{parseFloat(singleProduct.price).toLocaleString(
												'en-US',
												{
													minimumFractionDigits: 2,
												},
											)}
										</p>

										{/* <button>Add to Cart</button> */}
									</div>
								</div>
							</NavLink>
						);
					} else {
						return '';
					}
				})}
			</div>
			{/* <PageIndex
                searchObject={searchObject}
                pageType={pageType}
                setPageType={setPageType}
                setProducts={setProducts}
                products={products}
                category={category}
            /> */}
		</div>
	);
};
