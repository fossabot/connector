import dotenv from 'dotenv';
import * as bigcommerce from './connectors/bigcommerce';
import * as shopify from './connectors/shopify';
import { pushMultipleFiles, deleteOldFiles } from './sources/bitbucket/bitbucket';
import runWebhook from './helpers/webhooks';
import { isBigCommerce, isShopify } from './helpers/platform-resolver';

dotenv.config();

const ecommerceTasks = async () => {
  if (isBigCommerce()) {
    const products = await bigcommerce.fetchProductsData()
    await pushMultipleFiles('products', products, 'filename')
    await deleteOldFiles('products', products, 'filename')

    const brands = await bigcommerce.fetchBrandsData()
    await pushMultipleFiles('brands', brands, 'filename')
    await deleteOldFiles('brands', brands, 'filename')

    const categories = await bigcommerce.fetchCategoriesData()
    await pushMultipleFiles('categories', categories, 'filename')
    await deleteOldFiles('categories', categories, 'filename')
  }

  if (isShopify()) {
    const products = await shopify.fetchProductsData()
    await pushMultipleFiles('products', products, 'filename')
    await deleteOldFiles('products', products, 'filename')

    const collections = await shopify.fetchCollectionsData()
    await pushMultipleFiles('collections', collections, 'filename')
    await deleteOldFiles('collections', collections, 'filename')
  }
}

(async () => {
  await ecommerceTasks()
  await runWebhook('finish')
})()