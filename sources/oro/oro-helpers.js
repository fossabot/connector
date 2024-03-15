async function makeAuthApiRequest(endpoint, method, params = {}, data = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }
  
    try {
      const response = await axios({
        url: `${process.env.ORO_BASE_URL}${endpoint}`,
        method: method,
        headers: defaultHeaders,
        params: params,
        data: data
      });
  
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('API request failed');
    }
  }