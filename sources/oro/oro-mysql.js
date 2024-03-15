import { createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.ORO_MYSQL_HOST,
    port: process.env.ORO_MYSQL_PORT,
    user: process.env.ORO_MYSQL_USER,
    password: process.env.ORO_MYSQL_PASSWORD,
    database: process.env.ORO_MYSQL_DATABASE,
};

let _connection = null

const getProducts = async () => {
    const sqlQuery = `
        select op.*, ors.url_hash, ors.url, ors.slug_prototype, oppd.wysiwyg, oppd.wysiwyg_style from oro_product op 
        left join oro_product_slug ops on op.id = ops.product_id
        left join oro_redirect_slug ors on ops.slug_id = ors.id
        left join oro_product_prod_descr oppd on oppd.product_id = op.id
    `;


    const [rows] = await connection.execute(sqlQuery);

    return rows
}

const getProductPrices = async (productId) => {
    if (!_connection) {
        _connection = await createConnection(dbConfig);
    }

    const [prices] = await _connection.execute(`select price_list_id, quantity, value, currency from oro_price_product opp where product_id = ${productId}`);

    return prices
}

const getProductImages = async (productId) => {
    if (!_connection) {
        _connection = await createConnection(dbConfig);
    }

    const [images] = await _connection.execute(`
        select oaf.original_filename, oaf.filename  from oro_product_image opi 
        left join oro_attachment_file oaf on oaf.id = opi.image_id 
        where opi.product_id = ${productId}
    `);

    return images
}

const getProductPriceUnits = async (productId) => {
    if (!_connection) {
        _connection = await createConnection(dbConfig);
    }

    const [units] = await _connection.execute(`
        select opup.id, opup.unit_code from oro_product_unit_precision opup 
        where opup.product_id = ${productId} and opup.sell = 1
    `);

    return units
}

export {
    getProducts,
    getProductPrices,
    getProductImages,
    getProductPriceUnits,
}