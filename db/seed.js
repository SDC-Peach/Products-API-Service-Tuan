require('dotenv').config();
const { Pool } = require('pg');

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
}
const pool = new Pool(config);
pool.connect()
  .then(() => console.log('DB connected. Loading data now'))
  .catch(() => console.log('Failed DB connection'))

// Helper function to create the copy query for each CSV file
const copyQuery = (data) => {
  return `COPY ${data}
    FROM '/Users/tnguyen4/RFCE2209/SDC/SDC-Peach/Products-API-Service-Tuan/data/${data}.csv'
    DELIMITER ','
    CSV HEADER`
}
// Product Table
const copyProductData = copyQuery('product')
const copyRelatedData = copyQuery('related')
const copyStylesData = copyQuery('styles')
const copyFeaturesData = copyQuery('features')
const copyPhotosData = copyQuery('photos')
const copySkusData = copyQuery('skus')

pool.query(copyProductData)
  .then(() => {
    console.log('Loaded product data')
    // Related Table
    pool.query(copyRelatedData)
      .then(() => console.log('Loaded related data'))
      .catch(err => console.log('Could not load related data. Error:', err))
    // Features Table
    pool.query(copyFeaturesData)
      .then(() => console.log('Loaded features data'))
      .catch(err => console.log('Could not load features data. Error:', err))
    // Styles Table
    pool.query(copyStylesData)
      .then(() => console.log('Loaded styles data'))
      .catch(err => console.log('Could not load styles data. Error:', err))
    // Photos Table
    pool.query(copyPhotosData)
      .then(() => console.log('Loaded photos data'))
      .catch(err => console.log('Could not load photos data. Error:', err))
    // Skus Table
    pool.query(copySkusData)
      .then(() => {
        console.log('Loaded skus data')
        process.exit(1);
      })
      .catch(err => console.log('Could not load skus data. Error:', err))
  })
  .catch(err => {
    console.log('Could not load product data. Error:', err)
    process.exit(1);
  })

