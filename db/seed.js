const Promise = require("bluebird");
const fetch = require('node-fetch');
// ALL DATABASE FUNCTIONS BEING IMPORTED FROM THE DB INDEX FOLDER

// FUNCTIONS REQUIRED WITH A MORE ACCURATE PATH TO AVOID CIRCULAR DEPENDENCIES
const { addUser, updateUser, getUserById, getAllUsers } = require('./singletables/users');
const { categoryIdByName, getAllCategories } = require('./singletables/categories');
const { addProductAndCategory, getProductsByQuery, getAllProducts, getProductById, getProductsByCategory } = require('./singletables/products');
const { addCart, getCartHistoryStatus, getCartHistoryStatusAdmin, addProductToCart } = require('./singletables/cart');
const { addReview } = require('./singletables/reviews');
const { addViewClick, addCartClick, addBuyClick } = require('./singletables/clicks');
const { seedClicks } = require('./utils/utils');
const { salesQuery } = require('./sales');

// IMPORTED ARRAY FROM FILE CONTAINING ALL OF OUR SEEDED PRODUCTS
const productArray = require("./singletables/productObject");
// Imported array with all the random users

//
//
//
//TEST CASES & SEED DATA TO TEST DATABASE FUNCTIONS
//
//
//
async function seed() {
    try {
        // await createNewUsers();
        // await fillUsers();

        //These three test the sales query
        // await salesQuery({category: ['food', 'house'], username: ['john', 'susan'], age: [{from: 25, to: 45}], city: ['Jacksonville', 'Orlando']});
        // await salesQuery({category: [4], product: [135]});
        // await salesQuery({category: [4]});
        // await salesQuery();
        
        // await gettingAllUsers();
        // await creatingOneNewProduct();
        

        // await seedingProductObject();
        // await gettingProductsByQuery();
        // await updatingUsers();
        // await gettingUserById();
        // await clicks();
        // await seedClicks();

        // await gettingCategoryIdsByName();
        // await addingOneCart();
        // await seedingInitialReviews();
        // await gettingSeedReviewsByProduct();
        // await gettingAllCategories();
        // await gettingProductById();
        // await gettingProductsByCategory();
        // await makingProductCart();
        // console.log("Running get all products...");
        // const allProducts = await getAllProducts(1);
        // console.log("Result: ", allProducts);
    } catch (error) {
        throw error;
    }
}
async function createNewUsers() {
    try {
        //creating a new user
        console.log("creating user one");
        const user1 = await addUser({
            firstName: "Johnny",
            lastName: "Cash",
            isAdmin: true,
            isUser: true,
            birthdate: '1980-04-26',
            gender: 'male',
            email: "johnny@cash.com",
            password: "Password1",
            addressLine1: "4545 street",
            addressLine2: "",
            city: "Jax",
            state: "Fl",
            zipcode: "32210",
            country: "USA",
            phone: "555-555-5555",
            creditCard: 45454545454545455,
        });
        console.log("this is user 1 ", user1);
        console.log("creating user two, login in with minimum info ");
        const user2 = await addUser({
            firstName: "Joe",
            lastName: "Moe",
            isAdmin: false,
            isUser: true,
            birthdate: '1985-03-21',
            gender: 'female',
            email: "myemail2@you.com",
            password: "Password2",
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            zipcode: null,
            country: null,
            phone: null,
            creditCard: null,
        });
        console.log("user2 with minimum data ", user2);
        console.log("creating user three, login in with minimum info and repeated email ");
        const user3 = await addUser({
            firstName: "Joe",
            lastName: "Moe",
            isAdmin: false,
            isUser: true,
            birthdate: '1990-05-22',
            gender: 'male',
            email: "myemail3@you.com",
            password: "Password3",
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            zipcode: null,
            country: null,
            phone: null,
            creditCard: null,
        });
        console.log("user3 with minimum data ", user3);
        console.log("creating user four, missing info ");
        const user4 = await addUser({
            firstName: "Joe",
            lastName: "Moe",
            isAdmin: false,
            isUser: true,
            birthdate: '2000-06-23',
            gender: 'female',
            email: "myemail4@you.com",
            password: "not",
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            zipcode: null,
            country: null,
            phone: null,
            creditCard: null,
        });
        console.log("user4 with minimum data ", user4);
    } catch (error) {
        throw error;
    }
}

//add 2000 random US users. The function takes very long to execute. About 5 mins or more.
async function fillUsers() {
    try {
        //results=50 for development, 2000 final
        const data = await fetch('https://randomuser.me/api/?results=2000&nat=us');
        const newUsers = (await data.json()).results;
        // console.log(newUsers);
        const length = newUsers.length;

        await Promise.mapSeries(newUsers, function(item, index, length) {
            const user = addUser({
                firstName: item.name.first,
                lastName: item.name.last,
                birthdate: item.dob.date.slice(0, 10),
                gender: item.gender,
                isAdmin: false,
                isUser: true,
                email: item.email,
                password: item.login.password,
                addressLine1: `${item.location.street.number} ${item.location.street.name}`,
                addressLine2: '',
                city: item.location.city,
                state: item.location.state,
                zipcode: item.location.postcode,
                country: item.location.country,
                phone: item.phone,
                creditCard: null
        });
        
        return user;
        })

        
    } catch (error) {
        console.error('fillUsers()', error);
    }
}

async function gettingAllUsers() {
    try {
        console.log("Running getAllUsers...");
        const allUsers = await getAllUsers();
        console.log("all users result: ", allUsers);
    } catch (error) {
        throw error;
    }
}
async function seedingProductObject() {
    console.log("Adding all products in product array to db...");
    const length = productArray.length;
    try {
        await Promise.mapSeries(productArray, function (
            { name, price, description, image, category, isHighlighted = false },
            index,
            length
        ) {
            image = "/" + image;
            const newProduct = addProductAndCategory({
                name,
                price,
                description,
                image,
                category,
                isHighlighted
            });
            return newProduct;
        });
    } catch (error) {
        throw error;
    }
}
async function gettingProductsByQuery() {
    try {
        console.log("getting products by query...");
        const allProductsByQuery = await getProductsByQuery("desk", 1);
        console.log("Result: ", allProductsByQuery);
    } catch (error) {
        throw error;
    }
}
async function updatingUsers() {
    try {
        console.log("Updating User 2...");
        const user2 = await updateUser({
            id: 2,
            isAdmin: false,
            isUser: true,
            email: "myemail2@you.com",
            password: "Password2",
            firstName: "Joe",
            lastName: "Moe",
            addressLine1: "1234 Anywhere",
            addressLine2: null,
            city: "Anywhere",
            state: "Florida",
            zipcode: "12345",
            country: null,
            phone: "123-456-7890",
            creditCard: 1234567891234567,
        });
        console.log("Updated User2", user2);
    } catch (error) {
        throw error;
    }
}
async function gettingUserById() {
    try {
        console.log("Getting User By Id...");
        const user = await getUserById(1);
        console.log("Got user by id 1", user);
    } catch (error) {
        throw error;
    }
}
async function gettingCategoryIdsByName() {
    try {
        console.log("getting category ids by name");
        console.log("getting bath id 1 ", await categoryIdByName("bath"));
        console.log("getting car id by name (non existent) 2 ", await categoryIdByName("car"));
        console.log("getting bath id 1 ", await categoryIdByName("bath"));
        console.log("getting null id, should be false ", await categoryIdByName(null));
        console.log('getting "" id, should be false ', await categoryIdByName(""));
    } catch (error) {
        throw error;
    }
}
async function addingOneCart() {
    try {
        const newCart = await addCart({
            status: "active",
            lastUpdated: "09-22-2020",
            total: 99.99,
            userId: 1,
        });
        const cart2 = await addCart({
            status: "shipped",
            lastUpdated: "09-23-2020",
            total: 9.99,
            userId: 1,
        });
        const cart3 = await addCart({
            status: "processing",
            lastUpdated: "09-24-2020",
            total: 29.99,
            userId: 1,
        });
        const cart4 = await addCart({
            status: "cancelled",
            lastUpdated: "09-25-2020",
            total: 19.99,
            userId: 2,
        });
        console.log("four new carts in seed: ", newCart, cart2, cart3, cart4);
    } catch (error) {
        throw error;
    }
}
async function gettingNonActiveCartAdmin() {
    try {
        const history = await getCartHistoryStatusAdmin();
        console.log("non-active carts:", history);
    } catch (error) {
        throw error;
    }
}
async function gettingNonActiveCart() {
    try {
        // const id = await getUserById(2);
        const userHistory = await getCartHistoryStatus(2);
        console.log("user history:", userHistory);
    } catch (error) {
        throw error;
    }
}
async function seedingInitialReviews() {
    try {
        await addReview({
            creatorId: 1,
            productId: 1,
            score: 5,
            description: "Very pleased with this product!",
        });
        await addReview({
            creatorId: 1,
            productId: 5,
            score: 3,
            description: "Pleased",
        });
        await addReview({
            creatorId: 2,
            productId: 30,
            score: 1,
            description: "Very disappointed!",
        });
        await addReview({
            creatorId: 2,
            productId: 5,
            score: 5,
            description: "Experience could not have been better!",
        });
    } catch (error) {
        throw error;
    }
}
async function gettingSeedReviewsByProduct() {
    try {
        const reviews = await getReviewsByProductId(5);
        console.log("reviews by specific product: ", reviews);
    } catch (error) {
        throw error;
    }
}
async function gettingAllCategories() {
    try {
        const categories = await getAllCategories();
        console.log("all categories: ", categories);
    } catch (error) {
        throw error;
    }
}
async function gettingProductById() {
    try {
        const product = await getProductById(9);
        console.log("product by id in seed: ", product);
    } catch (error) {
        throw error;
    }
}
async function gettingProductsByCategory() {
    try {
        const products = await getProductsByCategory("school", 1);
        console.log("returning products by category in seed: ", products);
    } catch (error) {
        throw error;
    }
}
async function makingProductCart() {
    try {
        const productCart1 = await addProductToCart({
            productId: 2,
            cartId: 1,
            quantity: 4,
            unitPrice: 5.99,
        });
        const productCart2 = await addProductToCart({
            productId: 13,
            cartId: 2,
            quantity: 2,
            unitPrice: 199.99,
        });
        const productCart3 = await addProductToCart({
            productId: 4,
            cartId: 3,
            quantity: 45,
            unitPrice: 1.99,
        });
        console.log("product cart test: ", productCart1, productCart2, productCart3);
    } catch (error) {
        throw error;
    }
}


//clicks

async function clicks() {
    try {
        //add view clicks
        console.log('add view click to product 5, user 5', await addViewClick(5, 5));
        console.log('add second view click to product 5, user 5', await addViewClick(5, 5));
        console.log('add view click to product 10, user 8', await addViewClick(10, 8));
        //add cart clicks
        console.log('add cart click for click 1, product 5, user 5', await addCartClick(1, 5, 5));
        console.log('add cart click for click 3, product 10, user 8', await addCartClick(3, 10, 8));
        console.log('add cart click for click that doesnt exist', await addCartClick(11, 5, 5));
        console.log('add cart click for click that does exist, but wrong product ', await addCartClick(2, 1, 5));
        console.log('add cart click for click that does exist, but wrong user ', await addCartClick(2, 5, 11));
        //add buy click
        console.log('add a buy click to a click with a cart. Click 1, product 5, user 5', await addBuyClick(1, 5, 5));
        console.log('add buy click to click that doesnt exist', await addBuyClick(11, 5, 5));
        console.log('add a buy click for product with click, but not cart. It should fail. Click 2, product 5, user 5', await addBuyClick(2, 5, 5));
        console.log('add buy click for click 3, wrong product 11, right user 8', await addBuyClick(3, 11, 8));
        console.log('add buy click for click 3, right product 10, wrong user 15', await addBuyClick(3, 10, 15));
    } catch (error) {
        console.error('error with seeding view clicks', error);
    }
    
}


// async function gettingHighlightedProducts() {
//     try {
//         const products = await getHighlightedProducts();
//         console.log("returning highlighted products in seed: ", products);
//     } catch (error) {
//         throw error;
//     }
// }
module.exports = { seed };