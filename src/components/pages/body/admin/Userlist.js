/** @format */

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Pagination } from 'react-bootstrap';

import './Userlist.css';

import { getAllUsers, adminUpdateUser } from '../../../../api';
import { adminRegisterNewUser } from '../user/profileUtils';

export const Userlist = ({ user }) => {
	const [adminUserList, setAdminUserList] = useState([]);
	const [userPage, setUserPage] = useState(1);
	const [userPageLimit, setUserPageLimit] = useState(0);
	const [adminView, setAdminView] = useState('none');
	const [clickedIndex, setClickedIndex] = useState(-1);
	// Input values for add user
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isUser, setIsUser] = useState(true);
	// Input values for edit one user
	const [editEmail, setEditEmail] = useState('');
	const [editPassword, setEditPassword] = useState('');
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		getAllUsers(userPage, user.token)
			.then((response) => {
				setAdminUserList(response[1]);
				setUserPageLimit(response[0]);
			})
			.catch((error) => {
				console.error(error);
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userPage, edit]);

	// Input value handlers
	const handleFirstName = (event) => {
		setFirstName(event.target.value);
	};
	const handleLastName = (event) => {
		setLastName(event.target.value);
	};
	const handleEmail = (event) => {
		setEmail(event.target.value);
	};
	const handlePassword = (event) => {
		setPassword(event.target.value);
		setPassword2(event.target.value);
	};
	const handleIsAdmin = (event) => {
		setIsAdmin(event.target.checked);
	};
	// const handleIsUser = (event) => {
	// 	setIsUser(event.target.checked);
	// };
	// form handler that allows admin to add a new user
	const adminAddUser = async (event) => {
		event.preventDefault();
		try {
			await adminRegisterNewUser({
				firstName,
				lastName,
				email,
				password1: password,
				password2,
				isAdmin,
				isUser,
			});
		} catch (error) {
			throw error;
		}
	};
	// sets admin view which removes readonly from the inputs
	const enableEditMode = (item) => {
		setClickedIndex(item.id);
		if (adminView === 'none') {
			setAdminView('editOneUser');
		} else {
			setAdminView('none');
		}
	};

	const editUser = async (event, item) => {
		event.preventDefault();

		try {
			const fields = {
				email: editEmail === '' ? item.email : editEmail,
				password: editPassword,
				isAdmin: isAdmin,
				isUser: isUser,
			};
			if (editPassword === '') {
				delete fields.password;
			}
			await adminUpdateUser({
				id: item.id,
				fields: fields,
				token: user.token,
			});

			setAdminView('none');
			setEdit(!edit);
		} catch (error) {
			throw error;
		}
	};

	// Pagination handlers
	const firstHandler = () => {
		setClickedIndex(-1);
		if (userPage > 1) {
			setUserPage(1);
		}
	};
	const prevHandler = () => {
		setClickedIndex(-1);
		if (userPage > 1) {
			setUserPage(userPage - 1);
		}
	};
	const nextHandler = () => {
		setClickedIndex(-1);
		if (userPage < userPageLimit) {
			setUserPage(userPage + 1);
		}
	};
	const lastHandler = () => {
		setClickedIndex(-1);
		if (userPage < userPageLimit) {
			setUserPage(userPageLimit);
		}
	};

	return (
		<div className='userList'>
			<Form id='bootstrap-form'>
				<h3>Add New User</h3>
				<Row>	
					<Col>
						<Form.Group>
							<Form.Label>First Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='First Name'
								value={firstName}
								onChange={handleFirstName}
							></Form.Control>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Last Name'
								value={lastName}
								onChange={handleLastName}
							></Form.Control>
						</Form.Group>
					</Col>				
					<Col>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='text'
								placeholder='Email'
								value={email}
								onChange={handleEmail}
							></Form.Control>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Password'
								value={password}
								onChange={handlePassword}
							></Form.Control>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Admin</Form.Label>
							<Form.Control
								type='checkbox'
								placeholder='isAdmin'
								defaultChecked={false}
								onChange={handleIsAdmin}
							></Form.Control>
						</Form.Group>
					</Col>
				</Row>
				<Button onClick={adminAddUser}>Create</Button>
			</Form>
			
			<div className='user-list-container'>
				<h2 className='edit-h2'>Edit Existing Users</h2>
				{adminUserList.map((item, index) => {
					return (
						<div key={index}>
							{adminView === 'editOneUser' && clickedIndex === item.id ? (
								<Form id='bootstrap-form'>
									<h3>{item.firstName} {item.lastName}</h3>
									<Row>
										<Col>
											<Form.Group>
												<Form.Label>Email</Form.Label>
												<Form.Control
													type='text'
													placeholder={item.email}
													value={editEmail}
													onChange={(event) => setEditEmail(event.target.value)}
												></Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>Password</Form.Label>
												<Form.Control
													type='password'
													placeholder='Password'
													onChange={(event) =>
														setEditPassword(event.target.value)
													}
												></Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>Admin</Form.Label>
												<Form.Control 
													type='checkbox'
													defaultChecked={item.isAdmin}
													onChange={(event) =>
														setIsAdmin(event.target.checked)
													}
												></Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>User</Form.Label>
												<Form.Control
													id='checkbox2'
													type='checkbox'
													defaultChecked={item.isUser}
													onChange={(event) => {
														setIsUser(event.target.checked);
													}}
												></Form.Control>
											</Form.Group>
										</Col>
									</Row>
									{adminView === 'editOneUser' &&
										clickedIndex === item.id ? (
											<div>
												<Button
													onClick={() => setAdminView('none')}
												>Cancel</Button>

												<Button
													type='button'
													onClick={(event) => {editUser(event, item)}}
												>Authorize</Button>
											</div>
										) : (
											<Button
												className='edit-button'
												type='button'
												onClick={() => {
													enableEditMode(item);
												}}
											>Edit</Button>
										)
									}
								</Form>
							) : (
								<Form id='bootstrap-form'>
									<h3>{(item.firstName + '' + item.lastName)}</h3>
									<Row>
										<Col>
											<Form.Group>
												<Form.Label>Email</Form.Label>
												<Form.Control
													type='text'
													placeholder={item.email}
													value={item.email}
													readOnly
												></Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>Password</Form.Label>
												<Form.Control
													type='password'
													placeholder='Password'
													readOnly
												></Form.Control>
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>Admin</Form.Label>
												{item.isAdmin ? (
													<Form.Control 
														type='checkbox'
														checked
														readOnly
													></Form.Control>
												) : (
													<Form.Control 
														type='checkbox'
														readOnly													
													></Form.Control>
												)}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label>User</Form.Label>
												{item.isUser ? (
													<Form.Control
														type='checkbox'
														checked
														readOnly
													></Form.Control>
												) : (
													<Form.Control
														type='checkbox'
														readOnly
													></Form.Control>
												)}
											</Form.Group>
										</Col>
									</Row>
									{adminView === 'editOneUser' &&
										clickedIndex === item.id ? (
											<div>
												<Button
													onClick={() => setAdminView('none')}
												>Cancel</Button>

												<Button
													type='button'
													onClick={(event) => {editUser(event, item)}}
												>Authorize</Button>
											</div>
										) : (
											<Button
												className='edit-button'
												type='button'
												onClick={() => {
													enableEditMode(item);
												}}
											>Edit</Button>
										)
									}
								</Form>
							)}
							
						</div>
					);
				})}
			</div>
			<Pagination className='bootstrap-pagination'>
				{userPage === 1 ? (
					''
				) : (
					<>
						<Pagination.First onClick={firstHandler}/>
						<Pagination.Prev onClick={prevHandler}/>
					</>
				)}
				<Pagination.Item>{userPage}</Pagination.Item>
				{userPage === userPageLimit ? (
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
