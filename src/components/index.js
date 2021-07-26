/** @format */

// node to send all the exports into and to get all the exports out of just one place

//App
export { default as App } from "./App";

//api/index
export { addUser, getAllUsers, getProductsByQuery, addNewProduct } from "../api";

//main body
export { MainBody } from "./pages/body/MainBody";

//admin
export { Admin } from "./pages/body/admin/Admin";
export { OrdersProcessing } from "./pages/body/admin/OrdersProcessing";
export { Sales } from "./pages/body/admin/Sales";
export { Userlist } from "./pages/body/admin/Userlist";
export { AdminProductList } from "./pages/body/admin/AdminProductList";
export { SalesAnalysis } from "./pages/body/admin/SalesAnalysis";

//categories
export { Categories } from "./pages/body/categories/Categories";

//orders
export { Cart } from "./pages/body/orders/Cart";
export { Orders } from "./pages/body/orders/Orders";
export { Payment } from "./pages/body/orders/Payment";
export { Stripe, stripeConnection } from "./pages/body/orders/Stripe";
export { Success } from "./pages/body/orders/Success";

//products
export { Product } from "./pages/body/products/Product";
export { Productlist } from "./pages/body/products/Productlist";
export { AddProduct } from "./pages/body/products/AddProduct";
export { Review } from "./pages/body/products/Reviews";
export { PageIndex } from "./pages/body/products/PageIndex";
export { Promoted } from "./pages/body/products/Promoted";

//user
export { Checkout } from "./pages/body/user/Checkout";
export { Login } from "./pages/body/user/Login";
export { Profile } from "./pages/body/user/Profile";

//header and footer
export { Header } from "./pages/header/Header";
export { Footer } from "./pages/footer/Footer";

//utils
export { states, countries } from "./pages/body/user/profileUtils";
export { addProductToGuestCart, removeProductFromGuestCart } from "./utils";

// News
export { News } from "./pages/body/News/News";
