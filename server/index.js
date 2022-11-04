const express = require('express');
const app = express();
const client = require('../db/index.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('Hello World')
})

const baseURL = 'SDC-Peach';

app.get(`/${baseURL}/products/`, (req, res) => {
  console.log(`Reached products`);
  res.sendStatus(200);
})

app.get(`/${baseURL}/products/:product_id`, (req, res) => {
  let product_id = req.params.product_id;
  const queryProduct = `SELECT * FROM product WHERE id=${product_id}`
  client.query(queryProduct)
    .then(product => {
      // console.log('Product ', product.rows);
      const queryFeatures = `SELECT feature, value FROM features WHERE product_id=${product_id}`
      client.query(queryFeatures)
        .then(features => {
          // console.log('Features ', features.rows)
          product.rows[0].features = features.rows
          res.status(200).json(product.rows[0])
        })
        .catch(err => {
          res.status(500).json(err)
        })
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

app.get(`/${baseURL}/products/:product_id/styles`, (req, res) => {
  let product_id = req.params.product_id;
  const result = {product_id: req.params.product_id}
  const queryStyles = `SELECT * FROM styles WHERE product_id=${product_id}`
  client.query(queryStyles)
    .then(async (styles) => {
      // console.log('Styles ', styles.rows); // Returns an array of style objects where I'll need to add a photos property
      const allStyles = styles.rows;
      for (let i = 0; i < allStyles.length; i++) {
        let styleId = allStyles[i].style_id;
        const queryPhotos = `SELECT thumbnail_url, url FROM photos WHERE style_id=${styleId}`
        const querySkus = `SELECT size, quantity FROM skus WHERE style_id=${styleId}`
        const photos = await client.query(queryPhotos)
        // console.log('Photos ', photos.rows);
        const skus =  await client.query(querySkus)
        allStyles[i].photos = photos.rows;
        allStyles[i].skus = skus.rows;
      }
      // console.log('Styles array', allStyles);
      result.results = allStyles;
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

app.get(`/${baseURL}/products/:product_id/related`, (req, res) => {
  const product_id = req.params.product_id;
  const queryRelated = `SELECT related_id FROM related WHERE product_id=${product_id}`
  client.query(queryRelated)
    .then(related => {
      // console.log('Related', related.rows)
      const relatedId = []
      for (let i = 0; i < related.rows.length; i++) {
        relatedId.push(related.rows[i].related_id)
      }
      // console.log('Related arrays', relatedId)
      res.status(200).json(relatedId);
    })
    .catch(err => res.sendStatus(500))
})

app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})