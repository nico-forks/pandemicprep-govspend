import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import { AdminProductList, Userlist, OrdersProcessing, Sales, SalesAnalysis } from '../../../index';
import './Admin.css';


export const Admin = ({ user, setUser, setCart }) => {
	const [adminView, setAdminView] = useState('none');
	const [clickedIndex, setClickedIndex] = useState(-1);

	/** different components we may want inside the admin tab
	 * list of all products(most likely pagination)
	 * list of all users(most likely pagination)
	 * list of all carts by a user(will get rendered by clicking on a specific user)
	 *
	 */

	return (
		<>
			<div id='admin-nav'>
				<Button
					onClick={() => {
						setAdminView('products');
					}}
				>
					Products
				</Button>
				<Button
					onClick={() => {
						setAdminView('users');
					}}
				>
					Users
				</Button>
				<Button
					onClick={() => {
						setAdminView('processing');
					}}
				>
					Processing Orders
				</Button>
				<Button
					onClick={() => {
						setAdminView('sales');
					}}
				>
					Sales Report
				</Button>
				<Button
					onClick={() => setAdminView('salesanalysis')} >
					Sales Analysis
				</Button>
			</div>

			{adminView === 'none' ? (
				<div id='adminDiv'>
					<h1 id='adminh1'>Welcome Admin!</h1>
				</div>
			) : (
				''
			)}

			{adminView === 'products' ? (
				<AdminProductList
					user={user}
					adminView={adminView}
					setAdminView={setAdminView}
					clickedIndex={clickedIndex}
					setClickedIndex={setClickedIndex}
				/>
			) : (
				''
			)}
			{adminView === 'users' ? (
				<Userlist
					user={user}
					adminView={adminView}
					setAdminView={setAdminView}
					clickedIndex={clickedIndex}
					setClickedIndex={setClickedIndex}
					setUser={setUser}
					setCart={setCart}
				/>
			) : (
				''
			)}
			{adminView === 'processing' ? <OrdersProcessing user={user} /> : ''}
			{adminView === 'sales' ? <Sales user={user} /> : ''}
			{adminView === 'salesanalysis' ? <SalesAnalysis user={user} /> : ''}
		</>
	);
};

/** Products(dropdown)
 * add product
 *
 */
