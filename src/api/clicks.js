import axios from 'axios';


/**
 * 
 * @param {String} kindOfClick One of three kinds 'view', 'cart', 'buy', or 'remove'. This last one is when a product is removed from the cart
 * @param {Integer} clickId Integer or null if the kind is view
 * @param {Integer} productId 
 * @param {Integer} userId 
 * @param {String} token 
 * @returns 
 */

export async function addClick(kindOfClick, clickId, productId, userId, token) {
    console.log('getting to the api');
    try {
        
        let payload = kindOfClick === 'view' ? {productId, userId} : {clickId, productId, userId};
        
		const { data: click } = await axios.post('/api/clicks/' + kindOfClick, payload, {
			headers: { Authorization: 'Bearer ' + token },
		});
        
		return click;
	} catch (error) {
		console.error('Error adding view click from the api', error);
	}
}