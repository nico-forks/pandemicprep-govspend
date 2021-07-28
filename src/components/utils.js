/** @format */

export async function addProductToGuestCart(cartState, product) {
	const cart = { ...cartState };

	const alreadyPresent = cart.items.find((item) => {
		return item.id === product.id;
	});
	if (alreadyPresent) {
		cart.items.map((item) => {
			if (item.id === product.id) {
				item.quantity = item.quantity + 1;
				item.total = item.quantity * parseFloat(item.unitPrice);
			}
			return item;
		});
	} else {
		cart.items.push({
			id: product.id,
			quantity: 1,
			unitPrice: parseFloat(product.price),
			itemTotal: parseFloat(product.price),
			title: product.title,
			description: product.description,
			price: parseFloat(product.price),
			image: product.image,
			imageDescription: product.imageDescription,
			isHighlighted: product.isHighlighted,
			isActive: product.isActive,
		});
	}

	let cartQuantity = 0;
	let cartTotal = 0;
	cart.items.map((item) => {
		cartQuantity = cartQuantity + item.quantity;
		cartTotal = cartTotal + parseFloat(item.itemTotal);
		return item;
	});
	cart.cartQuantity = cartQuantity;
	cart.total = cartTotal;

	localStorage.setItem('panprepCart', JSON.stringify(cart));
	return cart;
}

export async function removeProductFromGuestCart(cartState, product) {
	const newCart = { ...cartState };
	let index;
	newCart.items.map((item, i) => {
		if (item.id === product.id) {
			index = i;
		}
		return item;
	});

	newCart.items.splice(index, 1);

	let newQuantity = 0;
	let newTotal = 0;
	newCart.items.map((item) => {
		newQuantity = newQuantity + item.quantity;
		newTotal = newTotal + parseFloat(item.itemTotal);
		return item;
	});
	newCart.cartQuantity = newQuantity;
	newCart.total = newTotal;
	return newCart;
}
