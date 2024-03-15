import axios from 'axios';
import productsQuery from './queries/products';
import collectionsQuery from './queries/collections';
import isDraftMode from '../../helpers/draft-mode';
import { removeEdgesAndNodes } from './shopify-helper'
import redirectionsQuery from './queries/redirections';

const makeRequest = async (query, variables = {}, isMulti = false) => {
    let store = process.env.SHOPIFY_STORE
    let apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION
    let accessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN

    if (isMulti) {
        store = process.env.MULTI_SHOPIFY_STORE
        apiVersion = process.env.MULTI_SHOPIFY_ADMIN_API_VERSION
        accessToken = process.env.MULTI_SHOPIFY_ADMIN_API_ACCESS_TOKEN    
    }

    const url = `https://${store}.myshopify.com/admin/api/${apiVersion}/graphql.json`;
    const headers = {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, {query, variables}, { headers });

        return response.data;
    } catch (error) {
        console.error('Error executing Shopify request:', error);
    }
}

const getProducts = async (cursor = null, isMulti = false) => {
    const query = `published_status:${isDraftMode() ? 'any' : 'published'}`

    const data = await makeRequest(productsQuery, { cursor, query }, isMulti);

    if (!data || !data.data || !data.data.products || !Array.isArray(data.data.products.edges)) {
        return [];
    }

    const { products } = data.data;

    const productArray = products.edges.map(edge => {
        const product = removeEdgesAndNodes(edge.node)

        product.currencyCode = product.priceRangeV2?.minVariantPrice?.currencyCode

        return product
    }).filter(Boolean);

    if (products.pageInfo.hasNextPage) {
        const lastCursor = products.edges[products.edges.length - 1].cursor;
        const nextPageProducts = await getProducts(lastCursor, isMulti);

        return productArray.concat(nextPageProducts);
    }

    return productArray;
}

const getCollections = async (cursor = null, isMulti = false) => {
    const data = await makeRequest(collectionsQuery, { cursor }, isMulti);

    if (!data || !data.data || !data.data.collections || !Array.isArray(data.data.collections.edges)) {
        return [];
    }

    const { collections } = data.data;


    const collectionsArray = collections.edges.map(edge => removeEdgesAndNodes(edge.node)).filter(Boolean);

    if (collections.pageInfo.hasNextPage) {
        const lastCursor = collections.edges[collections.edges.length - 1].cursor;
        const nextPageCollections = await getCollections(lastCursor, isMulti);

        return collectionsArray.concat(nextPageCollections);
    }

    return collectionsArray;
}

const getRedirections = async (cursor = null, isMulti = false) => {
    const query = `is_deleted:false`;
  
    const data = await makeRequest(redirectionsQuery, { cursor, query }, isMulti);

    if (
      !data ||
      !data.data ||
      !data.data.urlRedirects ||
      !Array.isArray(data.data.urlRedirects.edges)
    ) {
      return [];
    }
  
    const { urlRedirects } = data.data;
  
    const redirectionArray = urlRedirects.edges.map((edge) => {
      const redirection = removeEdgesAndNodes(edge.node);
  
      return redirection;
    }).filter(Boolean);
  
    if (urlRedirects.pageInfo.hasNextPage) {
      const lastCursor = urlRedirects.edges[urlRedirects.edges.length - 1].cursor;
      const nextPageRedirections = await getRedirections(lastCursor, isMulti);
  
      return redirectionArray.concat(nextPageRedirections);
    }
  
    return redirectionArray;
  };
  

export default {
    getProducts,
    getCollections,
    getRedirections,
}