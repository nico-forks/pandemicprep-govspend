import axios from 'axios';

/**
 * Gets Products from a Search Query
 * @param {string} query
 * @param {integer} pageNumber
 */
export async function getProductsByQuery(query, pageNumber) {
	try {
		const { data } = await axios.get(`/api/products/${query}/${pageNumber}`);

		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Adds New Product (ADMIN)
 * @param {object} newProduct
 */
export async function addNewProduct(newProduct) {
	try {
		const { data } = await axios.post('/api/products', newProduct);

		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Gets Product by Product ID
 * @param {integer} productId
 */
export async function getProductById(productId) {
	try {
		const { data } = await axios.get(`/api/products/${productId}`);

		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Gets Products by Category Name
 * @param {string} categoryName
 * @param {integer} pageNumber
 */
export async function getProductsByCategory(categoryName, pageNumber) {
	try {
		const { data } = await axios.get(`/api/products/category/${categoryName}/${pageNumber}`);

		return data;
	} catch (error) {
		throw error;
	}
}




//BELOW FUNCTION IS FOR FUTURE PRODUCTION
export async function getPromotedProducts() {
	try {
		const { data } = await axios.get('/api/products');

		return data;
	} catch (error) {
		throw error;
	}
}
