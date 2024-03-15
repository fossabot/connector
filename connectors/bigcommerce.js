import { findChildren, findParents, getCategoryFullName } from "../helpers/bigcommerce/category-helper"
import generatePageURL from "../helpers/generate-url"
import { isHugo } from "../helpers/platform-resolver"
import * as bigcommerce from "../sources/bigcommerce/bigcommerce"

const fetchProductsData = async () => {
    const bigCommerceProducts = await bigcommerce.getProducts()

    const processedProducts = [];

    for (const bigCommerceProduct of bigCommerceProducts) {
        const slug = bigCommerceProduct.custom_url?.url?.replace(/\//g, '')

        const product = {
            ...bigCommerceProduct,
            filename: slug
        };

        if (isHugo()) {
            product.description = product.description.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
            product.descriptionClean = product.description.replace(/<\/?[^>]+(>|$)/g, "");
            product.url = generatePageURL(slug, process.env.URL_PREFIX_PRODUCTS);
            product.type = 'product';
            product.layout = 'single';
        }

        delete product.cost_price;
        delete product.total_sold;

        if (product.variants) {
            product.variants.forEach(variant => {
                delete variant.cost_price;
            });
        }

        processedProducts.push(product);
    }

    return processedProducts;
}


const fetchBrandsData = async () => {
    const bigCommerceBrands = await bigcommerce.getBrands()

    const processedBrands = [];

    for (const bigCommerceBrand of bigCommerceBrands) {
        const urlSlug = bigCommerceBrand.custom_url?.url?.replace(/^\//, '');
        const slug = bigCommerceBrand.custom_url?.url?.replace(/\//g, '')

        const product = {
            ...bigCommerceBrand,
            filename: slug
        };

        if (isHugo()) {
            product.url = generatePageURL(urlSlug, '');
            product.type = 'brand';
            product.layout = 'single';
        }

        processedBrands.push(product);
    }

    return processedBrands;
}

const fetchCategoriesData = async () => {
    const bigCommerceCategories = await bigcommerce.getCategories()

    const processedCategories = [];

    for (const bigCommerceCategory of bigCommerceCategories) {
        const urlSlug = bigCommerceCategory.custom_url?.url?.replace(/^\//, '');
        const slug = bigCommerceCategory.custom_url?.url?.replace(/\//g, '')

        const category = {
            ...bigCommerceCategory,
            filename: slug,
        };

        category.path = getCategoryFullName(category.id, bigCommerceCategories)
        category.children = findChildren(bigCommerceCategories, category.id)
        category.parents = findParents(bigCommerceCategories, category.id)

        if (isHugo()) {
            category.url = generatePageURL(urlSlug, '');
            category.type = 'category';
            category.layout = 'single';
        }

        processedCategories.push(category);
    }

    return processedCategories;
}

export {
    fetchProductsData,
    fetchBrandsData,
    fetchCategoriesData
}