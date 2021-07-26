/** @format */


//EXPORTS ALL API FUNCTIONS

export { 
    getAllUsers, 
    getAllProducts, 
    getAllProcessing, 
    updateProduct, 
    adminUpdateUser, 
    completeOrder,
    getSalesReport,
    getAllProductNamesAndIds,
    getCities,
    getZipcodes
} from './admin'



export { addUser, updateUser, loginUser, guestUser, getFullUserFromToken } from "./users";
export { getProductsByQuery, addNewProduct } from "./products";
export { addNewCart, getOrderHistory } from "./orders";
export { addProductToCart, removeProductFromCart, deactivateCart, patchCartItemQuantity } from "./cart";
export { fetchNews } from './news'
export { getAllCategories } from './categories';
