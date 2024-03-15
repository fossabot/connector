const productsQuery = `query Products($cursor: String, $query: String!) {
  products(first: 4, after: $cursor, query: $query) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        title
        description
        descriptionHtml
        handle
        onlineStoreUrl
        productType
        publishedAt
        tags
        vendor
        createdAt
        updatedAt
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              sku
              availableForSale
              inventoryPolicy
              inventoryQuantity
              inventoryManagement
              selectedOptions {
                name
                value
              }
              metafields(first: 5, namespace: "b2s") {
                edges {
                  node {
                    id
                    key
                    value
                  }
                }
              }
            }
          }
        }
        images(first: 15) {
          edges {
            node {
              id
              originalSrc
            }
          }
        }
        metafields(first: 10, namespace: "b2s") {
          edges {
            node {
              id
              key
              value
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  }
}`

export default productsQuery