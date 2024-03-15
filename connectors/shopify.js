import generatePageURL from "../helpers/generate-url"
import { isHugo } from "../helpers/platform-resolver"
import * as shopify from "../sources/shopify/shopify"

const fetchProductsData = async () => {
    const shopifyProducts = await shopify.getProducts()

    const processedProducts = [];

    for (const product of shopifyProducts) {
        product.filename = product.handle;

        if (isHugo()) {
            product.url = generatePageURL(product.handle, process.env.URL_PREFIX_PRODUCTS);
            product.type = 'product';
            product.layout = 'single';
        }

        processedProducts.push(product);
    }

    return processedProducts;
}

const fetchCollectionsData = async () => {
    const shopifyCollections = await shopify.getCollections()

    return shopifyCollections.map(collection => {
        collection.filename = collection.handle;

        if (isHugo()) {
            collection.url = generatePageURL(collection.handle, process.env.URL_PREFIX_COLLECTIONS)
            collection.type = 'collection'
            collection.layout = 'list'
        }

        return collection
    });
}

export {
    fetchProductsData,
    fetchCollectionsData,
}