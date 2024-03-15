import bulkApi from "./shopify-bulk-api"
import adminApi from "./shopify-admin-api"

const SHOPIFY_BULK_API = 'BULK_API'
const SHOPIFY_ADMIN_API = 'ADMIN_API'

const getProducts = async (isMulti) => {
    if (process.env.SHOPIFY_API === SHOPIFY_BULK_API) {
        return await bulkApi.getProducts()
    }

    return await adminApi.getProducts(null, isMulti)
}

const getCollections = async (isMulti) => {
    if (process.env.SHOPIFY_API === SHOPIFY_BULK_API) {
        return await bulkApi.getCollections()
    }

    return await adminApi.getCollections(null, isMulti)
}

const getRedirections = async (isMulti) => {
    if (process.env.SHOPIFY_API === SHOPIFY_BULK_API) {
        /** @todo add support for bulk api request */
        // return await bulkApi.getCollections()
    }

    return await adminApi.getRedirections(null, isMulti)
}

export {
    getProducts,
    getCollections,
    getRedirections
}