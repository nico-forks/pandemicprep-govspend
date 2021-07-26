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
	getSalesReport,
	getCities,
	getZipcodes
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


//abandoned feature
// adminRouter.get('/users/names', async (req, res, next) => {
// 	try {
// 		if (req.user.isAdmin) {
// 			const names = await getAllUsernames();
// 			console.log(names);
// 			if (Array.isArray(names)) res.send(names);
// 			throw new Error('couldnt get names from getAllUsernames at the db');
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// })


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


adminRouter.get('/cities', async (req, res, next) => {
	try {
		if (req.user.isAdmin) {
			const cities = await getCities();
			if (Array.isArray(cities)) res.send(cities);
			throw new Error('cities route');
		}
	} catch (error) {
		next(error);
	}
});

adminRouter.get('/zipcodes', async (req, res, next) => {
	try {
		if (req.user.isAdmin) {
			const zipcodes = await getZipcodes();
			if (Array.isArray(zipcodes)) res.send(zipcodes);
			throw new Error('zipcodes route');
		}
	} catch (error) {
		next(error);
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
// adminRouter.get('/sales/:pageNumber', async (req, res, next) => {
// 	try {
// 		const { pageNumber } = req.params;
// 		if (req.user) {
// 			if (req.user.isAdmin) {
// 				const allOrderHistory = await getOrderHistory(pageNumber);
// 				res.send(allOrderHistory);
// 			} else {
// 				res.send({ message: 'You must be an admin to retrieve the sales report!' });
// 			}
// 		} else {
// 			res.send({ message: 'You must be an admin to retrieve the sales report!' });
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// });

adminRouter.get('/sales', async (req, res, next) => {
	
	try {
		if (req.user) {
			if (req.user.isAdmin) {
				const sales = await getSalesReport()
				
				res.send(sales)
			} else {
				res.send({ message: 'You must be an admin to retrieve the sales report!' });
			}
		} else {
			res.send({ message: 'You must be an admin to retrieve the sales report!' });
		}
	} catch (error) {
		next(error);
	}
})



module.exports = adminRouter;
