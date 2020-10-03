import axios from 'axios';

/**
 * gets a list of users
 * will require the user is admin later on
 */

export async function getAllUsers(pageNumber) {
    try {
      const { data } = await axios.get(`/api/admin/users/${pageNumber}`);
      console.log('all users in src api index: ', data);
      return data;
    } catch (error) {
      throw error;
    }
}

export async function getAllProducts(pageNumber, token) {
  try {
    const { data } = await axios.get(`/api/admin/products/${pageNumber}`, {headers: {Authorization: 'Bearer ' + token}});

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct({id, fields, token}) {
  try {
    console.log('getting to axios call', token)
    const { data } = await axios.patch('/api/admin', {id, fields}, {headers: {Authorization: 'Bearer ' + token}});

    return data;
  } catch (error) {
    throw error;
  }
}