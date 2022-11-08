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
  .catch((err) => console.log('Failed DB connection: Error', err))

const getProducts = (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const queryProducts = `SELECT * FROM product ORDER BY id ASC LIMIT ${count} OFFSET 0`;
  pool.query(queryProducts)
    .then(products => {
      res.status(200).json(products.rows)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

const getProduct = (req, res) => {
  const product_id = req.query.product_id;
  const queryProduct = `SELECT id, name, slogan, description, category, default_price FROM product WHERE id=${product_id}`
  const queryFeatures = `SELECT feature, value FROM features WHERE product_id=${product_id}`

  const searchProduct = pool.query(queryProduct)
    .then(product => product)
    .catch(err => err)
  const searchFeatures = pool.query(queryFeatures)
    .then(features => features)
    .catch(err => err)

  Promise.all([searchProduct, searchFeatures])
    .then(([product, features]) => {
      product.rows[0].features = features.rows;
      res.status(200).json(product.rows[0])
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

const getStyles = (req, res) => {
  const product_id = req.query.product_id;
  const result = {product_id: product_id}
  const queryStyles = `SELECT style_id, name, original_price, sale_price, default_style FROM styles WHERE product_id=${product_id}`
  pool.query(queryStyles)
    .then(async styles => {
      const allStyles = styles.rows;
      for (let i = 0; i < allStyles.length; i++) {
        let styleId = allStyles[i].style_id;
        // Reassign default style value to 'default?' key based on API documentation
        allStyles[i]['default?'] = allStyles[i].default_style;
        delete allStyles[i].default_style;

        const queryPhotos = `SELECT thumbnail_url, url FROM photos WHERE style_id=${styleId}`
        const querySkus = `SELECT * FROM skus WHERE style_id=${styleId}`
        const searchPhotos = pool.query(queryPhotos)
        const searchSkus = pool.query(querySkus)
        const photos = await searchPhotos;
        const skus = await searchSkus;
        // Format sku data based on API documentation
        const formatSku = {}
        for (let j = 0; j < skus.rows.length; j++) {
          let currentSku = skus.rows[j]
          formatSku[currentSku.id] = {
            quantity: currentSku.quantity,
            size: currentSku.size
          }
        }
        // Append photos and sku to each style object
        allStyles[i].photos = photos.rows;
        allStyles[i].skus = formatSku
      }
      result.results = allStyles;
      res.status(200).json(result)
    })
    .catch(err => res.status(500).json(err))
}

const getRelated = (req, res) => {
  const product_id = req.query.product_id;
  const queryRelated = `SELECT related_id FROM related WHERE product_id=${product_id}`
  pool.query(queryRelated)
    .then(related => {
      const relatedId = []
      for (let i = 0; i < related.rows.length; i++) {
        relatedId.push(related.rows[i].related_id)
      }
      res.status(200).json(relatedId);
    })
    .catch(err => res.sendStatus(500))
}

const getCart = (req, res) => {

}

const addToCart = (req, res) => {

}


module.exports = {
  getProducts,
  getProduct,
  getStyles,
  getRelated,
  getCart,
  addToCart
}