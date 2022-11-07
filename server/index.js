const express = require('express');
const app = express();
const { getProducts, getProduct, getStyles, getRelated } = require('./controllers.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const home = '/SDC-Peach';
app.get(`${home}`, (req, res) => {
  res.send('Welcome to Team Peach API service')
})

app.get(`${home}/products`, getProducts)
app.get(`${home}/products/:product_id`, getProduct)
app.get(`${home}/products/:product_id/styles`, getStyles)
app.get(`${home}/products/:product_id/related`, getRelated)

app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})