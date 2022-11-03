const express = require('express');
const app = express();
const client = require('../db/index.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.port || 3000;

app.listen(port, function() {
  console.log(`listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

