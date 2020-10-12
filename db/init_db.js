/** @format */

//Code to build and initialize DB goes here
//DROP TABLES & BUILD TABLES IN CORRECT ORDER
//POPULATING INITIAL DATA WITH SEED.JS

const { client } = require("./client");
const { seed } = require("./");

async function buildTables() {
    try {
        client.connect();

        await dropTables();

        await createTables();
    } catch (error) {
        throw error;
    }
}

/**
 * Database
 * products: image is a url or path
 * categories: image is a url or path
 * user: password and credit card are hashed
 * carts: status could be 'active', 'processing', 'complete'
 */
async function createTables() {
    try {
        await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title varchar(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL NOT NULL,
        image varchar(255),
        "imageDescription" varchar(255),
        "isHighlighted" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true
      );
      
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name varchar(255) UNIQUE NOT NULL,
        image varchar(255),
        "imageDescription" varchar(255)
      );

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        "isAdmin" BOOLEAN DEFAULT false,
        "isUser" BOOLEAN DEFAULT false,
        email varchar(255) UNIQUE NOT NULL,
        password varchar(255),
        "firstName" varchar(255) NOT NULL,
        "lastName" varchar(255) NOT NULL,
        "addressLine1" varchar(255),
        "addressLine2" varchar(255),
        city varchar(255),
        state varchar(255),
        zipcode varchar(255),
        country varchar(255),
        phone varchar(255),
        "creditCard" varchar(255)
      );

      CREATE TABLE carts (
        id SERIAL PRIMARY KEY,
        status varchar(255) NOT NULL,
        "cartQuantity" INTEGER DEFAULT 0,
        "lastUpdated" VARCHAR(21),
        total DECIMAL NOT NULL,
        "userId" INTEGER REFERENCES users(id)
      ); 

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        score INTEGER NOT NULL,
        description TEXT
      );

      CREATE TABLE products_categories (
        "jointId" SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "categoryId" INTEGER REFERENCES categories(id),
        UNIQUE ("productId", "categoryId")
      );

      CREATE TABLE products_carts (
        "jointId" SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "cartId" INTEGER REFERENCES carts(id),
        quantity INTEGER NOT NULL,
        "unitPrice" DECIMAL NOT NULL,
        "itemTotal" DECIMAL NOT NULL
      );

      
    `);
    } catch (error) {
        throw error;
    }
}

async function dropTables() {
    try {
        await client.query(`
      DROP TABLE IF EXISTS products_carts;
      DROP TABLE IF EXISTS products_categories;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS products;
    `);
    } catch (error) {
        throw error;
    }
}

async function populateInitialData() {
    try {
        await seed();
    } catch (error) {
        throw error;
    }
}

buildTables()
    .then(seed)
    .catch(console.error)
    .finally(() => client.end());
