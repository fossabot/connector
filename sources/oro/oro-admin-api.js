const makeApiRequest = async (endpoint, method, params = {}, data = {}) => {
    if (!_auth) {
        authorize()
    }

    const baseURL = `${process.env.ORO_BASE_URL}/admin/api`;
    const defaultHeaders = {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${auth.access_token}`,
    }

    try {
        const response = await axios({
            url: `${baseURL}${endpoint}`,
            method: method,
            headers: defaultHeaders,
            params: params,
            data: {
                data: data,
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('API request failed');
    }
}

let _auth = null

const authorize = async () => {
    _auth = await makeAuthApiRequest('/oauth2-token', 'POST', null, {
        "grant_type": "password",
        "client_id": "Yv_7IilNkFbHmJjFK8jx67yQbjkix3bu",
        "client_secret": "6YE1Rnje0cKsxFh9hTRawTOKNwi9hBtXN-KFkdHnveRNc4H1tL327Nw28DLuqvnX6r7NIAJk9v9vNs5SsqyS8C",
        "username": "admin",
        "password": "W7RHv+ba"
    });
}

const getProductImages = async (productId) => {
    const productData = await makeApiRequest(`/products/${productId}/images?include=image`)

    const filePaths = productData && productData.included && productData.included[0].attributes && productData.included[0].attributes.filePath;

    return filePaths && filePaths.map(filePath => ({
      url: filePath.url,
      dimension: filePath.dimension
    }));
}

export {
    getProductImages,
}