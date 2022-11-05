const client = require('../db/index.js');

const getProducts = (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const queryProducts = `SELECT * FROM product ORDER BY id ASC LIMIT ${count} OFFSET 0`;
  client.query(queryProducts)
    .then(products => {
      res.status(200).json(products.rows)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

const getProduct = (req, res) => {
  const product_id = req.query.product_id;
  const queryProduct = `SELECT * FROM product WHERE id=${product_id}`
  client.query(queryProduct)
    .then(product => {
      const queryFeatures = `SELECT feature, value FROM features WHERE product_id=${product_id}`
      client.query(queryFeatures)
        .then(features => {
          product.rows[0].features = features.rows;
          res.status(200).json(product.rows[0])
        })
        .catch(err => {
          res.status(500).json(err)
        })
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

const getStyles = (req, res) => {
  const product_id = req.query.product_id;
  const result = {product_id: product_id}
  const queryStyles = `SELECT style_id, name, original_price, sale_price, default_style FROM styles WHERE product_id=${product_id}`
  client.query(queryStyles)
    .then(async (styles) => {
      const allStyles = styles.rows;
      for (let i = 0; i < allStyles.length; i++) {
        let styleId = allStyles[i].style_id;
        const queryPhotos = `SELECT thumbnail_url, url FROM photos WHERE style_id=${styleId}`
        const querySkus = `SELECT * FROM skus WHERE style_id=${styleId}`
        const photos = await client.query(queryPhotos)
        const skus =  await client.query(querySkus)
        const formatSku = {}
        for (let j = 0; j < skus.rows.length; j++) {
          let currentSku = skus.rows[j]
          formatSku[currentSku.id] = {
            quantity: currentSku.quantity,
            size: currentSku.size
          }
        }
        // console.log('Format sku:', formatSku)
        allStyles[i].photos = photos.rows;
        allStyles[i].skus = formatSku;
      }
      result.results = allStyles;
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

const getRelated = (req, res) => {
  const product_id = req.query.product_id;
  const queryRelated = `SELECT related_id FROM related WHERE product_id=${product_id}`
  client.query(queryRelated)
    .then(related => {
      const relatedId = []
      for (let i = 0; i < related.rows.length; i++) {
        relatedId.push(related.rows[i].related_id)
      }
      res.status(200).json(relatedId);
    })
    .catch(err => res.sendStatus(500))
}

module.exports = {
  getProducts,
  getProduct,
  getStyles,
  getRelated
}