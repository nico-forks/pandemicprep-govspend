const express = require('express');
const adminRouter = express.Router();

const {
	getAllProducts,
	updateProduct,
	getAllUsers,
	updateUser,
	getProcessingCarts,
	completeCart,
	getOrderHistory,
} = require('../db');

//Gets all products (requires admin status)
adminRouter.get('/products/:pageNumber', async (req, res, next) => {
	try {
		const { pageNumber } = req.params;
		if (req.user) {
			if (req.user.isAdmin) {
				const products = await getAllProducts(pageNumber);
				res.send(products);
			} else {
				res.send({ message: 'You must be an admin to get all products!' });
			}
		} else {
			res.send({ message: 'You must be an admin to get all products!' });
		}
	} catch (error) {
		next(error);
	}
});

//Gets all users (requires admin status)
adminRouter.get('/users/:pageNumber', async (req, res, next) => {
	try {
		const { pageNumber } = req.params;
		if (req.user) {
			if (req.user.isAdmin) {
				const allUsers = await getAllUsers(pageNumber, req.user);
				res.send(allUsers);
			} else {
				res.send({ message: 'You must be an admin to get all users!' });
			}
		} else {
			res.send({ message: 'You must be an admin to get all users!' });
		}
	} catch (error) {
		throw error;
	}
});

//Updates products (requires admin status)

adminRouter.patch('/product', async (req, res, next) => {
	try {
		const id = req.body.id;
		const fields = req.body.fields;

		if (req.user) {
			if (req.user.isAdmin) {
				const updatedProduct = await updateProduct(id, fields);
				res.send(updatedProduct);
			} else {
				res.send({ message: 'You must be an admin to update a product!' });
			}
		} else {
			res.send({ message: 'You must be an admin to update a product!' });
		}
	} catch (error) {
		next(error);
	}
});

// Updates a user (requires admin status)

adminRouter.patch('/user', async (req, res, next) => {
	try {
		const id = req.body.id;
		const fields = req.body.fields;

		if (req.user) {
			if (req.user.isAdmin) {
				const updatedUser = await updateUser(id, fields);
				res.send(updatedUser);
			} else {
				res.send({ message: 'You must be an admin to update a user!' });
			}
		} else {
			res.send({ message: 'You must be an admin to update a user!' });
		}
	} catch (error) {
		next(error);
	}
});

// Gets all processing carts (requires admin status)

adminRouter.get('/processing/:pageNumber', async (req, res, next) => {
	try {
		const { pageNumber } = req.params;

		if (req.user) {
			if (req.user.isAdmin) {
				const allProcessing = await getProcessingCarts(pageNumber);
				res.send(allProcessing);
			} else {
				res.send({ message: 'You must be an admin to get all processing carts' });
			}
		} else {
			res.send({ message: 'You must be an admin to get all processing carts' });
		}
	} catch (error) {
		next(error);
	}
});

// Sets status of cart from processing to complete by cartId
adminRouter.patch('/finalizing', async (req, res, next) => {
	try {
		const { cartId } = req.body;
		if (req.user) {
			if (req.user.isAdmin) {
				const completedOrder = await completeCart(cartId);

				res.send(completedOrder);
			} else {
				res.send({ message: 'You must be an admin to complete an order' });
			}
		} else {
			res.send({ message: 'You must be an admin to complete an order' });
		}
	} catch (error) {
		next(error);
	}
});

// gets all cart history
adminRouter.get('/sales/:pageNumber', async (req, res, next) => {
	try {
		const { pageNumber } = req.params;
		if (req.user) {
			if (req.user.isAdmin) {
				const allOrderHistory = await getOrderHistory(pageNumber);
				res.send(allOrderHistory);
			} else {
				res.send({ message: 'You must be an admin to retrieve the sales report!' });
			}
		} else {
			res.send({ message: 'You must be an admin to retrieve the sales report!' });
		}
	} catch (error) {
		next(error);
	}
});

module.exports = adminRouter;
