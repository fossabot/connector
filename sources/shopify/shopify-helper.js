const removeEdgesAndNodes = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(removeEdgesAndNodes);
    }

    if (obj.hasOwnProperty('edges') && Array.isArray(obj.edges)) {
        return obj.edges.map(({ node }) => removeEdgesAndNodes(node));
    }

    const result = {};
    for (const key in obj) {
        result[key] = removeEdgesAndNodes(obj[key]);
    }

    return result;
}

const convertShopifyResourceIdToNumber = (resourceId) => {
    const numericString = resourceId.replace(/\D/g, '')
    const number = parseInt(numericString, 10)

    return number
}


export {
    removeEdgesAndNodes,
    convertShopifyResourceIdToNumber
}