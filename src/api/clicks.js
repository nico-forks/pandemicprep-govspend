import axios from 'axios';





export async function getClicks(token) {
    try {
        const { data } = await axios.get('/api/clicks/', {
			headers: { Authorization: 'Bearer ' + token },
		}); 
        
        return data;
    } catch (error) {
        console.error('error getting clicks from api', error);
    }
}




/**
 * 
 * @param {String} kindOfClick One of three kinds 'view', 'cart', 'buy', or 'remove'. This last one is when a product is removed from the cart
 * @param {Integer} clickId Integer or null if the kind is view
 * @param {Integer} productId 
 * @param {Integer} userId
 * @param {Integer} cartId 
 * @param {String} token 
 * @returns 
 */

export async function addClick(kindOfClick, clickId, productId, userId, cartId = 0, token) {
    
    try {
        
        let payload = kindOfClick === 'view' ? {productId, userId} : {clickId, productId, userId, cartId};
        
		const { data: click } = await axios.post('/api/clicks/' + kindOfClick, payload, {
			headers: { Authorization: 'Bearer ' + token },
		});
        
		return click;
	} catch (error) {
		console.error('Error adding or removing click from the api', error);
	}
}