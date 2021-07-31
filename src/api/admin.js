import axios from 'axios';

/**
 * Gets All Users (ADMIN)
 * @param {integer} pageNumber
 * @param {string} token
 */
export async function getAllUsers(pageNumber, token) {
	try {
		const { data } = await axios.get(`/api/admin/users/${pageNumber}`, {
			headers: { Authorization: 'Bearer ' + token },
		});
		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Gets All Products (ADMIN)
 * @param {integer} pageNumber
 * @param {string} token
 */
export async function getAllProducts(pageNumber, token) {
	try {
		const { data } = await axios.get(`/api/admin/products/${pageNumber}`, {
			headers: { Authorization: 'Bearer ' + token },
		});

		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * 
 * @param {String} token 
 * @returns {Array} [{id, title}]
 */
export async function getAllProductNamesAndIds(token) {
	
	try {
		const { data } = await axios.get('/api/products/all', {
			headers: { Authorization: 'Bearer ' + token }});

		return data;
	} catch (error) {
		console.error('error with getAllProductNamesAndIds at the api', error);
	}
}

/**
 * Gets all processing orders (ADMIN)
 * @param {*} param0
 */
export async function getAllProcessing(pageNumber, token) {
	try {
		const { data } = await axios.get(`/api/admin/processing/${pageNumber}`, {
			headers: { Authorization: 'Bearer ' + token },
		});

		return data;
	} catch (error) {
		throw error;
	}
}

/**
 * Updates Product (ADMIN)
 * @param {object} param0
 */
export async function updateProduct({ id, fields, token }) {
	
	try {
		const { data } = await axios.patch(
			'/api/admin/product',
			{ id, fields },
			{ headers: { Authorization: 'Bearer ' + token } },
		);

		return data;
	} catch (error) {
		throw error;
	}
}

export async function adminUpdateUser({ id, fields, token }) {
	try {
		const { data } = await axios.patch(
			'/api/admin/user',
			{ id, fields },
			{ headers: { Authorization: 'Bearer ' + token } },
		);

		return data;
	} catch (error) {
		throw error;
	}
}

export async function completeOrder(cartId, token) {
	try {
		const { data } = await axios.patch(
			`/api/admin/finalizing`,
			{ cartId },
			{ headers: { Authorization: 'Bearer ' + token } },
		);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function getSalesReport(token) {
	
	try {
		const { data } = await axios.get(`/api/admin/sales`, {
			headers: { Authorization: 'Bearer ' + token },
		});
		
		return data;
	} catch (error) {
		throw error;
	}
}

export async function getCities(token) {
	try {
		const { data } = await axios.get(`/api/admin/cities`, {headers: { Authorization: 'Bearer ' + token }});
		if (Array.isArray(data)) return data;
		throw new Error('cities');
	} catch (error) {
		console.error('error at getCities in admin api', error);
	}
}

export async function getZipcodes(token) {
	try {
		const { data } = await axios.get(`/api/admin/zipcodes`, {headers: { Authorization: 'Bearer ' + token }});
		if (Array.isArray(data)) return data;
		throw new Error('zipcodes');
	} catch (error) {
		console.error('error at getZipcodes in admin api', error);
	}
}

export async function getDeepSalesReport(token, query = {}) {
	
	try {
		const { data } = await axios.post(`/api/admin/sales`, query, {headers: { Authorization: 'Bearer ' + token }});
		if (Array.isArray(data)) return data;
		throw new Error('salesreport');
	} catch (error) {
		console.error('error at getSalesReport in admin api', error);
	}
} 