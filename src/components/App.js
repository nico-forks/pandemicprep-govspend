/** @format */
import { getProductsByCategory } from '../api/products';

import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
	NavLink,
	useHistory,
} from 'react-router-dom';

import {
	Header,
	Footer,
	Categories,
	Productlist,
	Profile,
	Cart,
	Product,
	Orders,
	Userlist,
	Sales,
	PageIndex,
	Admin,
	Promoted,
	News,
	Success,
} from './index';

import { getUserFromToken } from '../api/users';

import './App.css';
import { getAllCategories } from '../api/categories';

const App = () => {
	const [user, setUser] = useState({
		id: 0,
		firstName: 'Guest',
		isAdmin: false,
		isUser: false,
		token: '',
	});
	const [cart, setCart] = useState({ status: 'active', cartQuantity: 0, total: 0, items: [] });
	const [cartSize, setCartSize] = useState(0);
	const [products, setProducts] = useState([]);
	const [promotedProducts, setPromotedProducts] = useState([]);
	const [product, setProduct] = useState({});
	const [searchObject, setSearchObject] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryList, setCategoryList] = useState([]);
	const [category, setCategory] = useState(''); // const history = useHistory();
	const [pageType, setPageType] = useState('');
	const [view, setView] = useState('');
	const history = useHistory();
	const [profileCompleted, setProfileCompleted] = useState(false);

	//new for govspend
	const [clicks, setClicks] = useState([]);

	
	//for development only
	useEffect(() => {
		console.log(clicks);
	}, [clicks]);


	
	useEffect(() => {
		
		if (category === '') {
			// history.push("/");
			return;
		}
		getProductsByCategory(category.toLowerCase(), 1)
			.then((response) => {
				setSearchObject({ pageCount: response[0], categoryName: category });
				setProducts(response[1]);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [category]);

	useEffect(() => {
		//get user from token if present
		if (localStorage.getItem('panprepToken')) {
			getUserFromToken(localStorage.getItem('panprepToken'))
				.then((response) => {
					if (response.isUser) {
						setUser({
							id: response.id,
							firstName: response.firstName,
							isAdmin: response.isAdmin,
							isUser: response.isUser,
							token: response.token,
						});
						setCart(response.activeCart);
						setCartSize(response.activeCart.cartQuantity);
					} else {
						setUser({
							id: 0,
							firstName: 'Guest',
							isAdmin: false,
							isUser: false,
							token: '',
						});
						setCart({
							status: 'active',
							cartQuantity: 0,
							total: 0,
							items: [],
						});
						setCartSize(0);
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
		//get cart from local storage if present (guest only)
		if (user.firstName === 'Guest') {
			if (localStorage.getItem('panprepCart')) {
				const newCart = JSON.parse(localStorage.getItem('panprepCart'));
				setCart(newCart);
				setCartSize(newCart.cartQuantity);
			}
		}
		//get categories
		getAllCategories()
			.then((result) => {
				setCategoryList(result);
			})
			.catch((error) => console.error(error));
	}, []);

	return (
		<Router>
			<div className='App'>
				<Header
					products={products}
					setProducts={setProducts}
					searchObject={searchObject}
					setSearchObject={setSearchObject}
					useHistory={useHistory}
					NavLink={NavLink}
					promotedProducts={promotedProducts}
					setPageType={setPageType}
					setSearchTerm={setSearchTerm}
					setView={setView}
					user={user}
					setUser={setUser}
					cartSize={cartSize}
					setCart={setCart}
					setCartSize={setCartSize}
					setCategory={setCategory}
					setProfileCompleted={setProfileCompleted}
				/>
				<Switch>
					<Route exact path='/'>
						{/* <div id="products-with-page"> */}
						<Promoted
							NavLink={NavLink}
							setProduct={setProduct}
							useHistory={useHistory}
							clicks={clicks}
							setClicks={setClicks}
							user={user}
						/>
						<Categories
							setProducts={setProducts}
							NavLink={NavLink}
							setCategory={setCategory}
							category={category}
							categoryList={categoryList}
							setPageType={setPageType}
							setSearchObject={setSearchObject}
							useHistory={useHistory}
						/>
					</Route>
					<Route path='/productsview'>
						<div id='products-with-page'>
							<Productlist
								products={products}
								setProducts={setProducts}
								setProduct={setProduct}
								NavLink={NavLink}
								searchObject={searchObject}
								category={category}
								pageType={pageType}
								setPageType={setPageType}
								useHistory={useHistory}
								clicks={clicks}
								setClicks={setClicks}
								user={user}
							/>
							<PageIndex
								searchObject={searchObject}
								pageType={pageType}
								setPageType={setPageType}
								setProducts={setProducts}
								products={products}
								category={category}
								searchTerm={searchTerm}
							/>
						</div>
						<Categories
							// setProducts={setProducts}
							NavLink={NavLink}
							category={category}
							setCategory={setCategory}
							categoryList={categoryList}
							setPageType={setPageType}
							setSearchObject={setSearchObject}
							useHisotry={useHistory}
						/>
					</Route>
					<Route path='/register'>
						<Profile
							view={view}
							useHistory={useHistory}
							setView={setView}
							setUser={setUser}
							cart={cart}
							setCart={setCart}
							setCartSize={setCartSize}
							setProfileCompleted={setProfileCompleted}
						/>
					</Route>
					<Route path='/login'>
						<Profile
							view={view}
							useHistory={useHistory}
							setView={setView}
							setUser={setUser}
							cart={cart}
							setCart={setCart}
							setCartSize={setCartSize}
							setProfileCompleted={setProfileCompleted}
						/>
					</Route>
					<Route path='/guest'>
						<Profile
							view='guest'
							useHistory={useHistory}
							setView={setView}
							setUser={setUser}
							cart={cart}
							setCart={setCart}
							setCartSize={setCartSize}
							setProfileCompleted={setProfileCompleted}
						/>
					</Route>
					<Route path='/edit-user'>
						<Profile
							view={view}
							useHistory={useHistory}
							setView={setView}
							setUser={setUser}
							cart={cart}
							setCart={setCart}
							setCartSize={setCartSize}
							user={user}
							setProfileCompleted={setProfileCompleted}
						/>
					</Route>
					<Route path='/checkout'>
						<Profile
							view={view}
							useHistory={useHistory}
							setView={setView}
							setUser={setUser}
							cart={cart}
							setCart={setCart}
							setCartSize={setCartSize}
							user={user}
							setProfileCompleted={setProfileCompleted}
						/>
					</Route>
					<Route path='/product'>
						<Product
							product={product}
							setCart={setCart}
							cart={cart}
							setCartSize={setCartSize}
							user={user}
							clicks={clicks}
							setClicks={setClicks}
						/>
						<Categories
							setProducts={setProducts}
							NavLink={NavLink}
							category={category}
							setCategory={setCategory}
							categoryList={categoryList}
							setPageType={setPageType}
							setSearchObject={setSearchObject}
							useHistory={useHistory}
						/>
					</Route>
					<Route path='/cart'>
						<Cart
							cart={cart}
							setCart={setCart}
							user={user}
							cartSize={cartSize}
							setCartSize={setCartSize}
							setView={setView}
							useHistory={useHistory}
							profileCompleted={profileCompleted}
							clicks={clicks}
							setClicks={setClicks}
						/>
					</Route>

					{user.isUser ? (
						<Route path='/orders'>
							<Orders user={user} />
						</Route>
					) : (
						''
					)}

					<Route path='/user-list'>
						<Userlist />
					</Route>
					<Route path='/sales'>
						<Sales />
					</Route>
					{user.isAdmin ? (
						<Route path='/admin'>
							<Admin product={products} setProducts={setProducts} user={user} />
						</Route>
					) : (
						''
					)}

					<Route path='/news'>
						<News />
					</Route>
					<Route path='/success'>
						<Success />
					</Route>

					<Redirect to='/' />
				</Switch>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
