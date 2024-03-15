const isHugo = () => process.env.TARGET_PLATFORM === 'HUGO'
const isGatsby = () => process.env.TARGET_PLATFORM === 'GATSBY'
const isShopify = () => process.env.ECOMMERCE_PLATFORM === 'SHOPIFY'
const isBigCommerce = () => process.env.ECOMMERCE_PLATFORM === 'BIGCOMMERCE'

export {
    isGatsby,
    isHugo,
    isShopify,
    isBigCommerce
}