const express = require('express');
const app = express();
module.exports = { getProducts, getProduct, getStyles, getRelated } = require('./controllers.js')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const home = '/SDC-Peach';
app.get(`${home}`, (req, res) => {
  res.send('Welcome to Team Peach API service')
})
app.get(`${home}/products`, getProducts) // Get products
app.get(`${home}/products/:product_id`, getProduct) // Get a product
app.get(`${home}/products/:product_id/styles`, getStyles) // Get a product's style
app.get(`${home}/products/:product_id/related`, getRelated) // Get related product id
app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})