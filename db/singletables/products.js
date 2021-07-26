const { client } = require('../client');
//BLUEBIRD = promise handling
const Promise = require('bluebird');

//LIMIT is the amount of products allotted per page
const LIMIT = 24;

const { addCategory, categoryIdByName, getCategoryByName } = require('./categories');
const productArray = require('./productObject');

/**
 * Adds new Product to DB & includes its Category
 * @param {obejct} param0
 */
async function addProductAndCategory({ name, price, description, image, category, isHighlighted }) {
	const categories = category.split(' ');
	const length = categories.length;

	try {
		const newProduct = await addProduct({ name, price, description, image, isHighlighted });

		await Promise.mapSeries(categories, async function (category, index, length) {
			const categoryId = await categoryIdByName(category);
			const jointTable = await addProduct_Categories(newProduct.id, categoryId);
			return jointTable;
		});

		newProduct.price = parseFloat(newProduct.price);
		return newProduct;
	} catch (error) {
		throw error;
	}
}

//IS THIS NEEDED? PLEASE TAKE A SECOND LOOK ~ NOTE, IT BREAKS THE DB WHEN COMMENTED OUT THOUGH
/**
 * Adds new product
 * @param {object} param0
 */
async function addProduct({ name, price, description, image, isHighlighted }) {
	try {
		const cost = Math.round(((price * (Math.random() * 0.70 + 0.20 )) + Number.EPSILON) * 100) /100;
		const {
			rows: [newProduct],
		} = await client.query(
			`
		INSERT INTO products (title, price, cost, description, image, "isHighlighted")
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT DO NOTHING
		RETURNING *;
	`,

			[name, price, cost, description, image, isHighlighted],
		);
		if (newProduct) {
			newProduct.price = parseFloat(newProduct.price);
			return newProduct;
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}

/**
 * Gets all products by page
 * @param {integer} pageNumber
 */
async function getAllProducts(pageNumber = 1) {
	try {
		const OFFSET = LIMIT * (pageNumber - 1);

		const { rowCount } = await client.query(`
      SELECT * FROM products;
    `);

		const { rows } = await client.query(`
            SELECT * FROM products
            LIMIT ${LIMIT} OFFSET ${OFFSET};
        `);

		const pageCount = Math.ceil(rowCount / LIMIT);

		const productsInfo = await Promise.mapSeries(rows, async function (product, length, index) {
			product.price = parseFloat(product.price);
			const newProduct = await getProductById(product.id);
			return newProduct;
		});

		return [pageCount, productsInfo];
	} catch (error) {
		throw error;
	}
}

/**
 * Gets specific products by a Search Query
 * @param {string} searchQuery
 * @param {integer} pageNumber
 */
async function getProductsByQuery(query, pageNumber) {
	try {
		const OFFSET = LIMIT * (pageNumber - 1);

		if (query === '') {
			return await getAllProducts();
		}

		const { rowCount } = await client.query(`
      SELECT id FROM products 
      WHERE 
      title ILIKE '%${query}%'
      OR description ILIKE '%${query}%';
    `);

		const { rows } = await client.query(`
            SELECT id FROM products 
            WHERE 
            title ILIKE '%${query}%'
            OR description ILIKE '%${query}%'
            LIMIT ${LIMIT} OFFSET ${OFFSET};
        `);

		const prodIdArray = rows.map((product) => {
			const [newProductId] = Object.values(product);
			return newProductId;
		});

		const productsArray = await Promise.map(
			prodIdArray,
			async function (productId) {
				return await getProductById(productId);
			},
			{ concurrency: 25 },
		);

		productArray.forEach((product) => {
			product.price = parseFloat(product.price);
		});

		const pageCount = Math.ceil(rowCount / LIMIT);
		return [pageCount, productsArray];
	} catch (error) {
		throw error;
	}
}

//IS THIS NECCESSARY????????????????
/**
 * Gets products for Cart History for the user shopping history
 */
async function getProductsForCartHistory() {
	try {
		const { rows } = await client.query(`
		SELECT title, description, image, "imageDescription"
		FROM products;`);
		return rows;
	} catch (error) {
		throw error;
	}
}

/**
 * Gets product by product ID & Categories
 * @param {integer} productId
 */
async function getProductById(id) {
	try {
		const {
			rows: [product],
		} = await client.query(
			`
      SELECT * FROM products
      WHERE id=$1;
    `,
			[id],
		);

		const { rows: categories } = await client.query(
			`
      SELECT categories.name FROM categories 
      JOIN products_categories ON categories.id = products_categories."categoryId"
      JOIN products ON products.id = products_categories."productId"
      WHERE products.id=$1;
    `,
			[product.id],
		);

		const newCategories = categories.map((category) => {
			const [singleCat] = Object.values(category);
			return singleCat;
		});

		product.categories = newCategories;

		const { rows: reviews } = await client.query(
			`
    SELECT * FROM reviews 
    WHERE "productId" = $1;
  `,
			[product.id],
		);

		product.reviews = reviews;

		return product;
	} catch (error) {
		throw error;
	}
}

/**
 * Gets products by category name
 * @param {string} categoryName
 * @param {integer} pageNumber
 */
async function getProductsByCategory(category, pageNumber) {
	try {
		const OFFSET = LIMIT * (pageNumber - 1) + 1;

		const { rowCount } = await client.query(
			`
      SELECT products.id
      FROM products 
      JOIN products_categories ON products.id = products_categories."productId"
      JOIN categories ON categories.id = products_categories."categoryId"
      WHERE categories.name = $1;
    `,
			[category],
		);

		const { rows: productIds } = await client.query(
			`
          SELECT products.id
          FROM products 
          JOIN products_categories ON products.id = products_categories."productId"
          JOIN categories ON categories.id = products_categories."categoryId"
          WHERE categories.name = $1
          LIMIT ${LIMIT} OFFSET ${OFFSET};
      `,
			[category],
		);

		const prodIdArray = productIds.map((product) => {
			const [newProductId] = Object.values(product);
			return newProductId;
		});

		const productsArray = await Promise.map(
			prodIdArray,
			async function (productId) {
				return await getProductById(productId);
			},
			{ concurrency: 25 },
		);

		const pageCount = Math.ceil(rowCount / LIMIT);
		return [pageCount, productsArray];
	} catch (error) {
		throw error;
	}
}

/**
 * Gets all highlighted products
 */
async function getHighlightedProducts() {
	try {
		const { rows } = await client.query(`
     SELECT id FROM products 
     WHERE "isHighlighted" = true;
    `);

		const prodIdArray = rows.map((product) => {
			const [newProductId] = Object.values(product);
			return newProductId;
		});

		const productsArray = await Promise.map(
			prodIdArray,
			async function (productId) {
				return await getProductById(productId);
			},
			{ concurrency: 25 },
		);

		return productsArray;
	} catch (error) {
		throw error;
	}
}

/**
 * Updates the product
 * @param {integer} productId
 * @param {object} fields (product fields)
 */
async function updateProduct(id, fields = {}) {
	const setString = Object.keys(fields)
		.map((key, index) => `"${key}"=$${index + 1}`)
		.join(', ');

	if (setString.length === 0) {
		return;
	}
	try {
		const {
			rows: [product],
		} = await client.query(
			`
      UPDATE products 
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
			Object.values(fields),
		);

		return product;
	} catch (error) {
		throw error;
	}
}

/**
 * Populates the joint table between products and categories to be used in other functions
 * @param {integer} productId
 * @param {integer} categoryId
 */
async function addProduct_Categories(prodId, catId) {
	try {
		if (prodId > 0 && catId > 0) {
			const {
				rows: [product_categoriesItem],
			} = await client.query(
				`
                  INSERT INTO products_categories ("productId", "categoryId")
                  VALUES ($1, $2);
                  `,
				[prodId, catId],
			);
			if (product_categoriesItem) {
				return product_categoriesItem;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}

//returns the ids and titles of all the products
async function getAllProductNamesAndIds() {
	try {
		const { rows } = await client.query(`
			SELECT id, title
			FROM products
		`);
		if (Array.isArray(rows)) return rows;
		throw new Error('error retrieving products');
	} catch (error) {
		console.error('error with getAllProductNamesAndIds', error);
	}
}

module.exports = {
	getProductById,
	addProductAndCategory,
	getAllProducts,
	getProductsByQuery,
	addProduct,
	getProductsForCartHistory,
	getProductsByCategory,
	updateProduct,
	addProduct_Categories,
	getAllProductNamesAndIds,
	getHighlightedProducts,
};
