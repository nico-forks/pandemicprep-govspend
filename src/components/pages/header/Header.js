/** @format */

import React, { useState } from 'react';
import { Form, FormControl, Button, Dropdown } from 'react-bootstrap';

import './Header.css';

export const Header = ({
	setProducts,
	useHistory,
	NavLink,
	promotedProducts,
	setPageType,
	setView,
	setSearchTerm,
	user,
	setUser,
	cartSize,
	setCart,
	setCartSize,
	setCategory,
	setProfileCompleted,
}) => {
	const history = useHistory();
	const [searchString, setSearchString] = useState('');

	const handleSearchString = (event) => {
		setSearchString(event.target.value);
	};

	const searchProducts = (event) => {
		event.preventDefault();

		if (searchString.length > 0) {
			setPageType('search');
			setCategory('search');
			setSearchTerm(searchString);

			setSearchString('');
		} else {
			alert('Must enter search term(s)');
		}
		history.push('/productsview');
	};

	return (
		<div>
			<div id='headerWrap' className='StreamsHero-image'>
				<h1 id='prepared'>
					Are you prepared?
				</h1>
				<NavLink to='/news'>
					<Button id='updatedButton' onClick={() => setCategory('')}>
						Stay Updated
					</Button>
				</NavLink>
			</div>
			<div className='headerContainer'>
				<NavLink
					to='/'
					onClick={() => {
						setProducts(promotedProducts);
						setCategory('');
					}}
				>
					<img
						id='headLogo'
						src={process.env.PUBLIC_URL + '/styleimages/PANPREPLOGO.png'}
						alt='Panprep logo'
					/>
				</NavLink>

				<Form onSubmit={searchProducts} className='searchForm'>
					<FormControl
						value={searchString}
						onChange={handleSearchString}
						type='text'
						// className='searchTerm'
						placeholder='What are you looking for?'
						contentEditable='true'
					/>

					<Button variant='outline-primary' onClick={searchProducts} >Search</Button>
				</Form>

				{user.isUser === true ? (
					''
				) : (
					<>
						<button
							className='button'
							id='login'
							onClick={() => {
								setView('login');
								setCategory('');
								history.push('/login');
							}}
						>
							Login
						</button>

						<h3 id='breaker'>|</h3>
						<button
							className='button'
							id='signup'
							onClick={() => {
								setView('register');
								setCategory('');
								history.push('/register');
							}}
						>
							Sign Up
						</button>
					</>
				)}

				<h3 id='breaker'>|</h3>
				<button
					className='button'
					id='cart'
					onClick={() => {
						setCategory('');
						history.push('/cart');
					}}
				>
					<section id='cart-size'>{cartSize > 0 ? cartSize : ''}</section>
					<img id='cartLogo' src={process.env.PUBLIC_URL + '/styleimages/cart.png'} alt='cart logo' />
				</button>

				{user.isUser === false ? (
					''
				) : (
					<Dropdown  >
						<div className='dropdown'>
							<Dropdown.Toggle  variant="primary" id="dropdown-basic-button" >
								Welcome {user.firstName}!
								<img
									id='pointer'
									src={process.env.PUBLIC_URL + '/styleimages/pointer.png'}
									alt='small pointer arrow'
								/>
							</Dropdown.Toggle>
							<Dropdown.Menu  >
								{user.isAdmin ? (
									<Dropdown.Item className='dropdown-list-item' href='#' onClick={() => history.push('/admin')}>
										<img
											id='dropdownIcon'
											src={process.env.PUBLIC_URL + '/styleimages/admin.png'}
											alt='drop down icon'
										/>
										Admin
									</Dropdown.Item>
								) : (
									''
								)}
								<Dropdown.Item
								className='dropdown-list-item'
									href='#'
									onClick={() => {
										setView('edit');
										history.push('/edit-user');
									}}
								>
									<img
										id='dropdownIcon'
										src={process.env.PUBLIC_URL + '/styleimages/settings.png'}
										alt='drop down icon'
									/>
									Edit Profile
								</Dropdown.Item>
								<Dropdown.Item className='dropdown-list-item' href='#' onClick={() => history.push('/orders')}>
									<img
										id='dropdownIcon'
										src={process.env.PUBLIC_URL + '/styleimages/shop.png'}
										alt='drop down icon'
									/>
									Orders
								</Dropdown.Item>
								<Dropdown.Item
								className='dropdown-list-item'
									href='#'
									onClick={() => {
										localStorage.removeItem('panprepToken');
										setUser({
											firstName: 'Guest',
											isAdmin: false,
											isUser: false,
											token: '',
										});
										setCart({
											status: 'active',
											cartQuantity: 0,
											total: 0,
											items: [],
										});
										setCartSize(0);
										setProfileCompleted(false);
									}}
								>
									<img
										id='dropdownIcon'
										src={process.env.PUBLIC_URL + '/styleimages/logout.png'}
										alt='drop down icon'
									/>
									Log Out
								</Dropdown.Item>
							</Dropdown.Menu>
						</div>
					</Dropdown>
				)}
			</div>
		</div>
	);
};
