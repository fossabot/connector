import axios from "axios"

const getAverageRatingBySKU = async (sku) => {
    try {
        const result = await axios.get(`https://api.reviews.io/product/rating-batch?store=noho.co&sku=${sku}`)

        if (result && result.data && Array.isArray(result.data) && result.data.length) {
            const averageRating = result.data.reduce((sum, product) => {
                return sum + parseFloat(product.average_rating);
            }, 0.00) / result.data.length

            const totalNumRatings = result.data.reduce((sum, product) => {
                return sum + product.num_ratings;
            }, 0)

            return {
                rating: averageRating.toFixed(2),
                num_ratings: totalNumRatings
            }
        }
    } catch (error) { }

    return null
}

export {
    getAverageRatingBySKU,
}