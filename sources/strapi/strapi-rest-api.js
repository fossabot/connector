import axios from 'axios';
import isDraftMode from '../../helpers/draft-mode';

const makeRequest = async (path) => {
  const limit = 10; // Number of items per page
  let page = 1; // Initial page
  let allData = [];
  let moreData = true;

  while (moreData) {
    let url = `${process.env.STRAPI_URL}/api/${path}?publicationState=${isDraftMode() ? 'preview' : 'live'}&populate=deep,10&locale=all&pagination[page]=${page}&pagination[pageSize]=${limit}`;

    const response = await axios.get(url);
    
    allData = [...allData, ...response.data.data];
    
    if (response.data.data.length < limit) {
      moreData = false;
    } else {
      page += 1;
    }
  }
  
  return allData;
}

const getProducts = async () => {
  return await makeRequest(process.env.STRAPI_PRODUCTS_NODE)
}

const getCollections = async () => {
  return await makeRequest(process.env.STRAPI_COLLECTIONS_NODE)
}

const getByType = async (type) => {
  return await makeRequest(type)
}

export default {
  getProducts,
  getCollections,
  getByType
};