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
  .then(() => console.log('DB connected!'))
  .catch(() => console.log('Failed DB connection'))

// Helper function to create the copy query
const copyDataQuery = (data) => {
  return `COPY ${data}
    FROM '/Users/tnguyen4/RFCE2209/SDC/SDC-Peach/Products-API-Service-Tuan/data/${data}.csv'
    DELIMITER ','
    CSV HEADER;
    ON CONFLICT ${data} DO NOTHING`
}
// Product Table
const productSchemaAndLoad = `
  CREATE TABLE IF NOT EXISTS product
  (id INT,
   name VARCHAR(255) NOT NULL,
   slogan VARCHAR(1000) NOT NULL,
   description VARCHAR(1000) NOT NULL,
   category VARCHAR(255) NOT NULL,
   default_price VARCHAR(255) NOT NULL,
   PRIMARY KEY(id));
   ${copyDataQuery('product')}`
pool.query(productSchemaAndLoad)
  .then(() => console.log('Loaded product data'))
  .catch(err => console.log('Could not load product data. Error:', err))

// Related Table
const relatedSchema = `
  CREATE TABLE IF NOT EXISTS related
  (id INT,
   product_id INT,
   related_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(product_id) REFERENCES product(id));
   ${copyDataQuery('related')}`
pool.query(relatedSchema)
  .then(() => console.log('Loaded related data'))
  .catch(err => console.log('Could not load related data. Error:', err))
  
// Features Table
const featureSchema = `
  CREATE TABLE IF NOT EXISTS features
  (feature_id INT,
  product_id INT NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY(feature_id),
  FOREIGN KEY(product_id) REFERENCES product(id));
  ${copyDataQuery('features')}`
pool.query(featureSchema)
  .then(() => console.log('Loaded features data'))
  .catch(err => console.log('Could not load features data. Error:', err))

// Styles Table
const styleSchema = `
  CREATE TABLE IF NOT EXISTS styles
  (style_id INT,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  sale_price VARCHAR(255) NOT NULL,
  original_price INT NOT NULL,
  default_style BOOLEAN,
  PRIMARY KEY(style_id),
  FOREIGN KEY(product_id) REFERENCES product(id));
  ${copyDataQuery('styles')}`
pool.query(styleSchema)
  .then(() => console.log('Loaded styles data'))
  .catch(err => console.log('Could not load styles data. Error:', err))

// Photos Table
const photoSchema = `
  CREATE TABLE IF NOT EXISTS photos
  (photo_id INT,
   style_id INT,
   url VARCHAR,
   thumbnail_url VARCHAR,
   PRIMARY KEY(photo_id),
   FOREIGN KEY(style_id) REFERENCES styles(style_id));
   ${copyDataQuery('photos')}`
pool.query(photoSchema)
  .then(() => console.log('Loaded photos data'))
  .catch(err => console.log('Could not load photos data. Error:', err))
  
// Skus Table
const skuSchema = `
  CREATE TABLE IF NOT EXISTS skus
  (id INT,
   style_id INT,
   size VARCHAR(50),
   quantity INT,
   PRIMARY KEY(id),
   FOREIGN KEY(style_id) REFERENCES styles(style_id));
   ${copyDataQuery('skus')}`
pool.query(skuSchema)
  .then(() => console.log('Loaded skus data'))
  .catch(err => console.log('Could not load skus data. Error:', err))

const cartSchema = `
CREATE TABLE IF NOT EXISTS cart
(id INT,
  user_session INT,
  product_id INT,
  active INT,
  FOREIGN KEY(product_id) REFERENCES product(id));
  ${copyDataQuery('cart')}`
pool.query(cartSchema)
  .then(() => console.log('Loaded cart data'))
  .catch(err => console.log('Could not load cart data. Error:', err))


