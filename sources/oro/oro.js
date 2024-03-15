// const fetchProductsData = async () => {
//     const rows = oroDb.getProducts()
//     const strapiData = strapi.getProductsContent()

//     const strapiEntryKeys = strapiData.length > 0 ? Object.keys(strapiData[0]) : [];

//     const combinedData = await Promise.all(rows.map(async (row) => {
//       const strapiEntry = strapiData.find(
//         (entry) => entry.handle === row.slug_prototype
//       );

//       const emptyValuesObject = strapiEntryKeys.reduce(
//         (acc, key) => ({ ...acc, [key]: '' }),
//         {}
//       );

//       const prices = oroDb.getProductPrices(row.id)
//       const images = oroDb.getProductImages(row.id)
//       const units = oroDb.getProductPriceUnits(row.id)

//       return {
//         ...row,
//         ...(strapiEntry || emptyValuesObject),
//         "url": `products/${row.slug_prototype}`,
//         "prices": prices,
//         "images": images,
//         "units": units,
//         "id": row.id,
//         "media": await oroAdminApi.getProductImages(row.id)
//       };
//     }));

//     await connection.end();
// }