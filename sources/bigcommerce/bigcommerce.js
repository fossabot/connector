import axios from "axios";

const makeRequest = async (endpoint, method = "GET", data = {}) => {
    const url = `https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3${endpoint}`;
    const headers = {
        'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios({
            url: url,
            method: method,
            headers: headers,
            data: data
        });

        return response.data;
    } catch (error) {
        console.error('Error executing BigCommerce request:', error);
    }
}

const getProducts = async () => {
    let allProducts = [];
    let page = 1;
    const LIMIT = 250;

    while (true) {
        const endpoint = `/catalog/products?limit=${LIMIT}&page=${page}&include=variants,images,custom_fields,bulk_pricing_rules,primary_image,videos,modifiers,options`;
        const data = await makeRequest(endpoint);

        if (data.data && data.data.length === 0 || page === 10) {
            break;
        }

        allProducts = allProducts.concat(data.data);
        page++;
    }

    return allProducts;
}

const getBrands = async () => {
    let items = [];
    let page = 1;
    const LIMIT = 250;

    while (true) {
        const endpoint = `/catalog/brands?limit=${LIMIT}&page=${page}`;
        const data = await makeRequest(endpoint);

        if (data.data && data.data.length === 0 || page === 10) {
            break;
        }

        items = items.concat(data.data);
        page++;
    }

    return items;
}

const getCategories = async () => {
    let items = [];
    let page = 1;
    const LIMIT = 250;

    while (true) {
        const endpoint = `/catalog/categories?limit=${LIMIT}&page=${page}`;
        const data = await makeRequest(endpoint);

        if (data.data && data.data.length === 0 || page === 10) {
            break;
        }

        items = items.concat(data.data);
        page++;
    }

    return items;
}

export {
    getProducts,
    getBrands,
    getCategories,
    makeRequest
}