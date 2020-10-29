import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PageIndex.css';
import { getProductsByQuery } from '../../../../api/products';
import { getProductsByCategory } from '../../../../api/products';

export const PageIndex = ({
	pageType,
	setProducts,
	category,
	searchTerm,
}) => {
	const [page, setPage] = useState(1);
	const [pageLimit, setPageLimit] = useState(0);

	useEffect(() => {
		if (pageType === 'category') {
			getProductsByCategory(category.toLowerCase(), page)
				.then((response) => {
					setPageLimit(response[0]);
					setProducts(response[1]);
				})
				.catch((error) => {
					console.error(error);
				});
		} else if (pageType === 'search') {
			getProductsByQuery(searchTerm, page)
				.then((response) => {
					setPageLimit(response[0]);
					setProducts(response[1]);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [page, category, searchTerm]);

	useEffect(() => {
		if (page > 1) {
			setPage(1);
		}
	}, [category, searchTerm]);

	const firstHandler = () => {
		if (page > 1) {
			setPage(1);
		}
	};

	const prevHandler = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const nextHandler = () => {
		if (page < pageLimit) {
			setPage(page + 1);
		}
	};

	const lastHandler = () => {
		if (page < pageLimit) {
			setPage(pageLimit);
		}
	};

	return (
		<Pagination className='bootstrap-pagination'>
				{page === 1 ? (
					''
				) : (
					<>
						<Pagination.First onClick={firstHandler}/>
						<Pagination.Prev onClick={prevHandler}/>
					</>
				)}
				<Pagination.Item>{page}</Pagination.Item>
				{page === pageLimit ? (
					''
				) : (
					<>
						<Pagination.Next onClick={nextHandler}/>
						<Pagination.Last onClick={lastHandler}/>
					</>
				)}

			</Pagination>
	);
};
