require('dotenv').config();
const { Client, Pool } = require('pg');
const { Sequelize } = require('sequelize');

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
}
const client = new Client(config);

client.connect()
  .then(res => console.log('Successfully connect to db'))
  .catch(err => console.log('Failed to connect to db'))

// Helper function to create the copy query
const copyDataQuery = (data) => {
  return ` UPDATE ${data}
    FROM '/Users/tnguyen4/RFCE2209/SDC/SDC-Peach/Products-API-Service-Tuan/data/${data}.csv'
    DELIMITER ','
    CSV HEADER`
}

// Product Table
const productSchema = `
  CREATE TABLE IF NOT EXISTS product
  (id INT,
   name VARCHAR(255) NOT NULL,
   slogan VARCHAR(1000) NOT NULL,
   description VARCHAR(1000) NOT NULL,
   category VARCHAR(255) NOT NULL,
   default_price VARCHAR(255) NOT NULL,
   PRIMARY KEY(id))`

client.query(productSchema)
  .then(res => {
    console.log('Created product table')
    client.query(copyDataQuery('product'))
      .then(res => {
        console.log('Copied data from product CSV')
      })
      .catch(err => {
        console.log('Could not copy from product CSV')
      })
  })
  .catch(err => {
    console.log('Could not create product table')
  })

// Related Table
const relatedSchema = `
  CREATE TABLE IF NOT EXISTS related
  (id INT,
   product_id INT,
   related_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(product_id) REFERENCES product(id))`

client.query(relatedSchema)
  .then(res => {
    console.log('Created related table')
    client.query(copyDataQuery('related'))
      .then(res => {
        console.log('Copied data from related CSV')
      })
      .catch(err => console.log('Could not copy from related CSV'))
  })
  .catch(err => console.log('Could not create related table'))

// Features Table
const featureSchema = `
  CREATE TABLE IF NOT EXISTS features
  (feature_id INT,
  product_id INT NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY(feature_id),
  FOREIGN KEY(product_id) REFERENCES product(id))`

client.query(featureSchema)
  .then(res => {
    console.log('Created feature table')
    client.query(copyDataQuery('features'))
      .then(res => {
        console.log('Copied data from features CSV')
      })
      .catch(err => console.log('Could not copy from features CSV'))
  })
  .catch(err => console.log('Could not create features table'))

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
  FOREIGN KEY(product_id) REFERENCES product(id))`

client.query(styleSchema)
  .then(res => {
    console.log('Created styles table')
    client.query(copyDataQuery('styles'))
      .then(res => {
        console.log('Copied data from styles CSV')
      })
      .catch(err => console.log('Could not copy from styles CSV'))
  })
  .catch(err => console.log('Could not create styles table'))

// Photos Table
const photoSchema = `
  CREATE TABLE IF NOT EXISTS photos
  (photo_id INT,
   style_id INT,
   url VARCHAR,
   thumbnail_url VARCHAR,
   PRIMARY KEY(photo_id),
   FOREIGN KEY(style_id) REFERENCES styles(style_id))`

client.query(photoSchema)
  .then(res => {
    console.log('Created photos table')
    client.query(copyDataQuery('photos'))
      .then(res => {
        console.log('Copied data from photos CSV')
      })
      .catch(err => console.log('Could not copy from photos CSV'))
  })
  .catch(err => console.log('Could not create photos table'))

// Skus Table
const skuSchema = `
  CREATE TABLE IF NOT EXISTS skus
  (id INT,
   style_id INT,
   size VARCHAR(50),
   quantity INT,
   PRIMARY KEY(id),
   FOREIGN KEY(style_id) REFERENCES styles(style_id))`

client.query(skuSchema)
  .then(res => {
    console.log('Created skus table')
    client.query(copyDataQuery('skus'))
      .then(res => {
        console.log('Copied data from skus CSV')
      })
      .catch(err => console.log('Could not copy from skus CSV'))
  })
  .catch(err => console.log('Could not create skus table'))

module.exports = client;