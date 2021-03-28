import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Pagination } from 'react-bootstrap';

import './AdminProductList.css';

import { getAllProducts, addNewProduct, updateProduct } from '../../../../api/index';

export const AdminProductList = ({ user }) => {
	const [adminProductList, setAdminProductList] = useState([]);
	const [adminPage, setAdminPage] = useState(1);
	const [adminPageLimit, setAdminPageLimit] = useState(0);
	const [adminView, setAdminView] = useState('none');
	const [clickedIndex, setClickedIndex] = useState(-1);

	// input values for adding new product
	const [title, setTitle] = useState('');
	const [categories, setCategories] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [imageURL, setImageURL] = useState('');
	const [isActive, setIsActive] = useState(true);
	// input values for editing a product
	const [edit, setEdit] = useState(false);
	const [editTitle, setEditTitle] = useState('');
	const [editDescription, setEditDescription] = useState('');
	const [editPrice, setEditPrice] = useState('');
	const [editImageURL, setEditImageURL] = useState('');
	const resetInputs = () => {
		setEditTitle('');
		setEditDescription('');
		setEditPrice('');
		setEditImageURL('');
	};

	useEffect(() => {
		setAdminView('none');
		setTitle('');
		setDescription('');
		setPrice('');
		setImageURL('');
		getAllProducts(adminPage, user.token)
			.then((response) => {
				setAdminProductList(response[1]);
				setAdminPageLimit(response[0]);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [adminPage, edit]);

	// Input value handlers
	const handleTitle = (event) => {
		setTitle(event.target.value);
	};
	const handleDescription = (event) => {
		setDescription(event.target.value);
	};
	const handlePrice = (event) => {
		setPrice(event.target.value);
	};
	const handleImageURL = (event) => {
		setImageURL(event.target.value);
	};
	const handleCategories = (event) => {
		setCategories(event.target.value);
	};
	const adminAddProduct = async (event) => {
		event.preventDefault();

		try {
			const newProduct = await addNewProduct({
				name: title,
				description,
				price,
				imageURL,
				category: categories,
			});
			resetInputs();
			return newProduct;
		} catch (error) {
			throw error;
		}
		
	};

	const enableEditMode = (index, item) => {
		setClickedIndex(index);
		if (adminView === 'none') {
			setAdminView('editOneProduct');
		}
	};
	const editProduct = async (event, item) => {
		event.preventDefault();
		
		try {
			const fields = {
				title: editTitle === '' ? item.title : editTitle,
				description: editDescription === '' ? item.description : editDescription,
				price:
					editPrice === ''
						? parseFloat(item.price).toFixed(2)
						: parseFloat(editPrice).toFixed(2),
				image: editImageURL === '' ? item.imageURL : editImageURL,
				isActive: isActive,
			};

			const updatedProduct = await updateProduct({
				id: item.id,
				fields: fields,
				token: user.token,
			});
			resetInputs();
			setAdminView('none');
			setEdit(!edit);
		} catch (error) {
			throw error;
		}
	};

	// Pagination handlers
	const firstHandler = () => {
		setClickedIndex(-1);
		if (adminPage > 1) {
			setAdminPage(1);
		}
	};
	const prevHandler = () => {
		setClickedIndex(-1);
		if (adminPage > 1) {
			setAdminPage(adminPage - 1);
		}
	};
	const nextHandler = () => {
		setClickedIndex(-1);
		if (adminPage < adminPageLimit) {
			setAdminPage(adminPage + 1);
		}
	};
	const lastHandler = () => {
		setClickedIndex(-1);
		if (adminPage < adminPageLimit) {
			setAdminPage(adminPageLimit);
		}
	};

	return (
		<div id='admin'>
				<Pagination className='bootstrap-pagination'>
				{adminPage === 1 ? (
					''
				) : (
					<>
						<Pagination.First onClick={firstHandler}/>
						<Pagination.Prev onClick={prevHandler}/>
					</>
				)}
				<Pagination.Item>{adminPage}</Pagination.Item>
				{adminPage === adminPageLimit ? (
					''
				) : (
					<>
						<Pagination.Next onClick={nextHandler}/>
						<Pagination.Last onClick={lastHandler}/>
					</>
				)}

			</Pagination>


			{adminPage === 1 ? (
			
					<Form id='add-product-form'>
					<h3 id='add-product-h3' >Add New Product</h3>
							<Row>
								<Col>
									<Form.Group>
										<Form.Label>Title</Form.Label>
										<Form.Control
											type='text'
											placeholder='Title'
											value={title}
											onChange={handleTitle}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Price</Form.Label>
										<Form.Control
											type='text'
											placeholder='Price'
											value={price}
											onChange={handlePrice}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Categories</Form.Label>
										<Form.Control
											type='text'
											placeholder='Categories'
											value={categories}
											onChange={handleCategories}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Image</Form.Label>
										<Form.Control
											type='text'
											placeholder='Image URL'
											value={imageURL}
											onChange={handleImageURL}
										></Form.Control>
									</Form.Group>
								</Col>
							</Row>

							<Form.Group id='add-description-group' >
								<Form.Label>Description</Form.Label>
								<Form.Control
									as='textarea'
									type='text'
									placeholder='Description'
									value={description}
									onChange={handleDescription}
								></Form.Control>								
							</Form.Group>
							<Button id='add-product-button' onClick={adminAddProduct}>
								Create
							</Button>						
					</Form>
				
			) : (
					''
				)}

			<div id='all-edit-forms'>
				<h3 id='edit-product-h3'>Edit Existing Products</h3>
				{adminProductList.map((item, index) => {
					return (
					<Form key={index} id='edit-product-form' >
						{adminView === 'editOneProduct' && clickedIndex === index ? (
						<>
							<h3>{item.title}</h3>
							<Row>
								<Col>
									<Form.Group>
										<Form.Label>Title</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.title}
											value={editTitle}
											onChange={(event) => {
												setEditTitle(event.target.value);
											}}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Price</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.price}
											value={editPrice}
											onChange={(event) => {
												setEditPrice(event.target.value);
											}}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Categories</Form.Label>
										<Form.Control
											type='text' 
											placeholder={item.categories}
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Image</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.image}
											value={item.image}
											onChange={(event) => {
												setEditImageURL(event.target.value);
											}}
										></Form.Control>
									</Form.Group>
								</Col>								
							</Row>
							<Form.Group>
									<Form.Label >Description</Form.Label>
									<Form.Control
										as='textarea'
										className='control-description'
										type='text'
										placeholder={item.description}
										value={editDescription}
										onChange={(event) => {
											setEditDescription(event.target.value);
										}}
									></Form.Control>
							</Form.Group>
							<Row xs={2} md={4} lg={6} id='last-edit-row'>
								<Col>
									<Form.Group id='check-group'>
										<Form.Label className='check-label' >Active: </Form.Label>
										<Form.Check
											id='react-checkbox'
											type='checkbox'
											defaultChecked={isActive}
											onClick={(event) => {
												isActive
													? setIsActive(false)
													: setIsActive(true);
											}}
										></Form.Check>
									</Form.Group>
								</Col>
								<div className='edit-check-col'>																	
									{adminView === 'editOneProduct' &&
										clickedIndex === index ? (
											<div>
												<Button
													onClick={() => setAdminView('none')}
												>Cancel</Button>

												<Button
													type='button'
													
												>Authorize</Button>
											</div>
										) : (
											<Button
												className='edit-button'
												type='button'
												onClick={() => {
													enableEditMode(index, item);
												}}
											>Edit</Button>
										)
									}
								</div>
							</Row>
						</>						
						) : (
						<>
							<h3>{item.title}</h3>

							<Row>
								<Col>
									<Form.Group>
										<Form.Label>Title</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.title}
											value={item.title}
											readOnly							
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Price</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.price}
											value={item.price}
											readOnly
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Categories</Form.Label>
										<Form.Control
											type='text' 
											placeholder={item.categories}
											readOnly
										></Form.Control>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group>
										<Form.Label>Image</Form.Label>
										<Form.Control
											type='text'
											placeholder={item.image}
											value={item.image}
											readOnly
										></Form.Control>
									</Form.Group>
								</Col>								
							</Row>
							<Form.Group>
									<Form.Label >Description</Form.Label>
									<Form.Control
										as='textarea'
										className='control-description'
										type='text'
										placeholder={item.description}
										value={item.description}
										readOnly
									></Form.Control>
							</Form.Group>
							<Row xs={2} md={4} lg={6} id='last-edit-row'>
								<Col>
									<Form.Group id='check-group'>
										<Form.Label className='check-label' >Active: </Form.Label>
										{item.isActive ? (
											<Form.Check
												id='react-checkbox'
												type='checkbox'
												checked
												readOnly
											></Form.Check>
										) : 
											<Form.Check
												id='react-checkbox'
												type='checkbox'												
												readOnly
											></Form.Check>
										}
									</Form.Group>
								</Col>
								<div className='edit-check-col'>																	
									{adminView === 'editOneProduct' &&
										clickedIndex === index ? (
											<div id='cancel-authorize'>
												<Button className='edit-button'>Cancel</Button>
												<Button
													type='button'
													
												>Authorize</Button>
											</div>
										) : (
											<Button
												id='edit-button'
												type='button'
												onClick={() => {
													enableEditMode(index, item);
												}}
											>Edit</Button>
										)
									}
								</div>
							</Row>
						</>
						)}
					</Form>


						
					
					);
				})}
			</div>

			<Pagination className='bootstrap-pagination'>
				{adminPage === 1 ? (
					''
				) : (
					<>
						<Pagination.First onClick={firstHandler}/>
						<Pagination.Prev onClick={prevHandler}/>
					</>
				)}
				<Pagination.Item>{adminPage}</Pagination.Item>
				{adminPage === adminPageLimit ? (
					''
				) : (
					<>
						<Pagination.Next onClick={nextHandler}/>
						<Pagination.Last onClick={lastHandler}/>
					</>
				)}

			</Pagination>

			{/* <div id='pagination'>
				{adminPage === 1 ? (
					''
				) : (
						<>
							<button onClick={firstHandler}>
								❮❮
						</button>
							<button onClick={prevHandler}>
								❮
						</button>
						</>
					)}
				<button>{adminPage}</button>
				{adminPage === adminPageLimit ? (
					''
				) : (
						<>
							<button onClick={nextHandler}>
								❯
						</button>
							<button  onClick={lastHandler}>
								❯❯
						</button>
						</>
					)}
			</div> */}
		</div>
	);
};
