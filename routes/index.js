/** @format */

const apiRouter = require('express').Router();
const { getUserById } = require('../db/');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

//Header Authorization & Bearer Token (Is Admin or Is User or is Guest)
apiRouter.use(async (req, res, next) => {
	const prefix = 'Bearer ';
	const auth = req.headers.authorization;

	if (!auth) {
		next();
	} else if (auth.startsWith(prefix)) {
		const token = auth.slice(prefix.length);

		try {
			const { id, isAdmin, isUser } = jwt.verify(token, JWT_SECRET);

			if (id) {
				req.user = await getUserById(id);

				next();
			}
		} catch ({ name, message }) {
			next({ name, message });
		}
	} else {
		next({
			name: 'AuthorizationHeaderError',
			message: `Authorization token must start with ${prefix}`,
		});
	}
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

const ordersRouter = require('./orders');
apiRouter.use('/orders', ordersRouter);

const reviewsRouter = require('./reviews');
apiRouter.use('/reviews', reviewsRouter);

const categoriesRouter = require('./categories');
apiRouter.use('/categories', categoriesRouter);

const adminRouter = require('./admin');
apiRouter.use('/admin', adminRouter);

const cartRouter = require('./cart');
apiRouter.use('/cart', cartRouter);

const clicksRouter = require('./clicks');
apiRouter.use('/clicks', clicksRouter);

module.exports = apiRouter;
