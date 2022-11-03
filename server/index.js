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
  console.log(`Reached styles of product id`, req.params.product_id);
  res.sendStatus(200);
})

app.get(`/${baseURL}/products/:product_id/related`, (req, res) => {
  console.log(`Reached related of product id`, req.params.product_id);
  res.sendStatus(200);
})

app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})