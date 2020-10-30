/** @format */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Stripe, stripeConnection } from '../orders/Stripe';
import { Form, Button } from 'react-bootstrap';

import {
	addUser,
	getAllUsers,
	getProductsByQuery,
	loginUser,
	getFullUserFromToken,
	addProductToCart,
	deactivateCart,
} from '../../../../api';

import {
	states,
	countries,
	registrationHandler,
	loginHandler,
	guestHandler,
	updateHandler,
} from './profileUtils';

import './Profile.css';
import { getUserFromToken } from '../../../../api/users';

export const Profile = ({
	view,
	setView,
	setUser,
	user,
	cart,
	setCart,
	setCartSize,
	setProfileCompleted,
}) => {
	//CURRENT VIEWS: login register guest userCheckout edit fulledit checkout-register
	//CHANGE PASSWORD Button: needs onclick function to switch state to ''
	//SET UP STATES FOR DIFFERENT VIEWS! :)

	const [isUser, setIsUser] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zipcode, setZipcode] = useState('');
	const [country, setCountry] = useState('');
	const [phone, setPhone] = useState('');
	const [creditCard, setCreditCard] = useState(
		Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1)) + 1000000000000000,
	);
	const [searchString, setSearchString] = useState('');
	const history = useHistory();

	if (view === '') {
		history.push('/');
	}

	if (view === 'edit' || view === 'fulledit') {
		if (!user.isUser) {
			history.push('/');
		}
	}

	useEffect(() => {
		if (view === 'edit' || view === 'fulledit' || view === 'userCheckout') {
			getFullUserFromToken(user.id, user.token).then((result) => {
				setFirstName(result.firstName);
				setLastName(result.lastName);
				setEmail(result.email);
				setAddress1(result.addressLine1);
				setAddress2(result.addressLine2);
				setCity(result.city);
				setState(result.state);
				setZipcode(result.zipcode);
				setCountry(result.country);
				setPhone(result.phone);
			});
		}
	}, []);

	const cancelHandler = (event) => {
		event.preventDefault();
		if (view === 'edit' || view === 'fulledit') {
			history.push('/');
		} else {
			resetForm();
		}
	};

	const passwordButtonHandler = (event) => {
		event.preventDefault();

		setView('fulledit');
	};

	const formHandler = async (event) => {
		event.preventDefault();

		try {
			//Registration
			let newUser = {};
			if (view === 'register' || view === 'checkout-register') {
				newUser = await registrationHandler({
					firstName,
					lastName,
					email,
					password1,
					password2,
					addressLine1: address1,
					addressLine2: address2,
					city,
					state,
					zipcode,
					country,
					phone,
				});
				console.log('new user from profile ', newUser);
				if (newUser.message) {
                    alert(newUser.message);
                    return;
				}
					setUser({
						id: newUser.id,
						firstName: newUser.firstName,
						isAdmin: newUser.isAdmin,
						isUser: newUser.isUser,
						token: newUser.token,
					});
				
				if (view === 'register') {
					setCart(newUser.activeCart);
					setCartSize(newUser.activeCart.cartQuantity);
					history.push('/');
					return;
				} else if (view === 'checkout-register') {
					cart.items.forEach(async (item) => {
						await addProductToCart(
							{
								userId: newUser.id,
								productId: item.id,
								cartId: newUser.activeCart.id,
								quantity: item.quantity,
								unitPrice: parseFloat(item.price),
							},
							newUser.token,
						);
					});
					// setCart(await deactivateCart({userId: newUser.id, cartId: newUser.activeCart.id}, newUser.token));
					deactivateCart(
						{ userId: newUser.id, cartId: newUser.activeCart.id },
						newUser.token,
					).then((result) => {
						setCart(result);
						setCartSize(result.cartQuantity);
					});
					setUser({
						id: newUser.id,
						firstName: newUser.firstName,
						isAdmin: newUser.isAdmin,
						isUser: newUser.isUser,
						token: newUser.token,
					});

					// setCartSize(cart.cartQuantity);
					history.push('/success');
					return;
				}
			}
			//login
			if (view === 'login') {
                const user = await loginHandler({ email, password1 });
                if (user.message) {
                    alert(user.message);
                    return;
                }
				setUser({
					id: user.id,
					firstName: user.firstName,
					isAdmin: user.isAdmin,
					isUser: user.isUser,
					token: user.token,
				});
				setCart(user.activeCart);
				setCartSize(user.activeCart.cartQuantity);
				history.push('/');
				return;
			}
			//guest
			let newGuest = {};
			if (view === 'guest') {
				addUser({
					firstName,
					lastName,
					email,
					addressLine1: address1,
					addressLine2: address2,
					city,
					state,
					zipcode,
					country,
					phone,
				})
					.then((result) => {
                        if (result.message) {
                            alert(result.message);
                            return;
                        }
						newGuest = result;

						cart.items.forEach(async (item) => {
							await addProductToCart(
								{
									userId: newGuest.id,
									productId: item.id,
									cartId: newGuest.activeCart.id,
									quantity: item.quantity,
									unitPrice: parseFloat(item.price),
								},
								newGuest.token,
							);
						});
					})
					.then(() => {
						deactivateCart(
							{ userId: newGuest.id, cartId: newGuest.activeCart.id },
							newGuest.token,
						).then(() => {
							setCart({ status: 'active', cartQuantity: 0, total: 0, items: [] });
							setCartSize(0);
						});
					});
				history.push('/success');
				return;
			}
			//edit and full edit
			if (
				(view === 'edit' || view === 'fulledit' || view === 'userCheckout') &&
				user.isUser
			) {
				const editObject = {
					firstName,
					lastName,
					email,
					password1,
					password2,
					addressLine1: address1,
					addressLine2: address2,
					city,
					state,
					zipcode,
					country,
					phone,
				};
				if (password1 === '') {
					delete editObject.password1;
					delete editObject.password2;
				}

				updateHandler(editObject, user.token);
				if (view === 'edit' || view === 'fulledit') {
					history.push('/');
					return;
				} else if (view === 'userCheckout') {
					setCart(await deactivateCart({ userId: user.id, cartId: cart.id }, user.token));
					setCartSize(0);
					history.push('/success');
					return;
				}
			}
		} catch (error) {
			console.error(error);
		}

		resetForm();
		history.push('/');
	};

	function warning(warningMessage) {
		alert(warningMessage);
	}

	function resetForm() {
		setFirstName('');
		setLastName('');
		setEmail('');
		setPassword1('');
		setPassword2('');
		setAddress1('');
		setAddress2('');
		setCity('');
		setState('Alabama');
		setZipcode('');
		setCountry('United States');
		setPhone('');
	}

	//CURRENT VIEWS: login register guest userCheckout edit
	return (
		<div className='profile'>
			<Form className='profileForm' onSubmit={formHandler}>
				<h1 className='editPro'>
					{view === 'register'
						? 'Sign Up'
						: view === 'login'
						? 'Log In'
						: view === 'edit' || view === 'fulledit'
						? 'Edit Profile'
						: view === 'guest'
						? 'Guest Checkout'
						: view === 'userCheckout'
						? 'User Checkout'
						: view === 'checkout-register'
						? 'Create Account'
						: ''}
				</h1>

				<Form.Control
					type='text'
					id='firstName'
					placeholder='First Name'
					value={firstName}
					className={view === 'login' ? 'field hide' : 'field'}
					onChange={(event) => setFirstName(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='text'
					id='lastName'
					value={lastName}
					placeholder='Last Name'
					className={view === 'login' ? 'field hide' : 'field'}
					onChange={(event) => setLastName(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>

				<Form.Control
					type='text'
					id='email'
					className='field'
					placeholder='Email Address'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Button
					id='reveal'
					variant='light'
					className={
						view === 'register' ||
						view === 'userCheckout' ||
						view === 'login' ||
						view === 'guest' ||
						view === 'fulledit' ||
						view === 'checkout-register'
							? 'field hide'
							: 'field'
					}
					onClick={passwordButtonHandler}
				>
					Change Password
				</Button>
				<Form.Control
					type='password'
					id='password1'
					value={password1}
					placeholder='Password'
					className={
						view === 'guest' || view === 'userCheckout' || view === 'edit'
							? 'field hide'
							: 'field'
					}
					onChange={(event) => setPassword1(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='password'
					id='password2'
					value={password2}
					placeholder='Verify Password' //
					className={
						view === 'guest' ||
						view === 'userCheckout' ||
						view === 'login' ||
						view === 'edit'
							? 'field hide'
							: 'field'
					}
					onChange={(event) => setPassword2(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='text'
					id='addressOne'
					value={address1}
					placeholder='Address Line One'
					className={
						view === 'register' || view === 'login' || view === 'userCheckout'
							? 'field hide'
							: 'field'
					}
					onChange={(event) => setAddress1(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='text'
					id='addressTwo'
					value={address2}
					placeholder='Address Line Two'
					className={
						view === 'register' || view === 'login' || view === 'userCheckout'
							? 'field hide'
							: 'field'
					}
					onChange={(event) => setAddress2(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='text'
					id='city'
					value={city}
					className={view === 'register' || view === 'login' ? 'field hide' : 'field'}
					placeholder='City'
					onChange={(event) => setCity(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='text'
					id='zipCode'
					value={zipcode}
					className={view === 'register' || view === 'login' ? 'field hide' : 'field'}
					placeholder='Zip Code'
					onChange={(event) => setZipcode(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					as='select'
					id='states'
					className={view === 'login' || view === 'register' ? 'field hide' : 'field'}
					value={state}
					onChange={(event) => {
						setState(event.target.value);
					}}
				>
					{states.map((state, i) => {
						return (
							<option key={i} value={state}>
								{state}
							</option>
						);
					})}
				</Form.Control>
				<Form.Control
					as='select'
					id='countries'
					className={view === 'register' || view === 'login' ? 'field hide' : 'field'}
					value={country}
					onChange={(event) => {
						setCountry(event.target.value);
					}}
				>
					{countries.map((country, i) => {
						return (
							<option key={i} value={country}>
								{country}
							</option>
						);
					})}
				</Form.Control>
				<Form.Control
					type='text'
					id='phoneNumber'
					value={phone}
					placeholder='Phone Number'
					className={view === 'register' || view === 'login' ? 'field hide' : 'field'}
					onChange={(event) => setPhone(event.target.value)}
					onKeyDown={(event) =>
						event.target.value === 'return' || event.target.value === 'enter'
							? formHandler
							: ''
					}
				/>
				<Form.Control
					type='number'
					id='creditCard'
					placeholder='Credit Card Number'
					className={view === 'register' || view === 'login' ? 'field hide' : 'field'}
					value={creditCard}
					readOnly
				/>

				<br></br>
				<Button id='submit' variant='light' type='submit'>
					{view === 'userCheckout' || view === 'guest' || view === 'checkout-register'
						? 'Complete Payment'
						: 'Submit'}
				</Button>
				<br></br>
				<Button id='cancel' variant='light' onClick={cancelHandler}>
					Cancel
				</Button>
			</Form>
		</div>
	);
};
