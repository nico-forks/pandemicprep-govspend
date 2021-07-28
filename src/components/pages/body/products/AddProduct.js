import React, { useState } from 'react';

import './AddProduct.css';

export const AddProduct = () => {
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [categories, setCategories] = useState('');

	const handleName = (event) => {
		setName(event.target.value);
	};

	const handlePrice = (event) => {
		setPrice(event.target.value);
	};

	const handleDescription = (event) => {
		setDescription(event.target.value);
	};

	const handleImage = (event) => {
		setImage(event.target.value);
	};

	const handleCategories = (event) => {
		setCategories(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

	};

	return (
		<form onSubmit={handleSubmit}>
			<input placeholder='name' value={name} onChange={handleName} />

			<input placeholder='price' value={price} onChange={handlePrice} />

			<input placeholder='description' value={description} onChange={handleDescription} />

			<input placeholder='image' value={image} onChange={handleImage} />

			<input placeholder='categories' value={categories} onChange={handleCategories} />

			<button />
		</form>
	);
};
