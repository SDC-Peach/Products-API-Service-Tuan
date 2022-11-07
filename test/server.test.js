const axios = require('axios')
const { test_product_10, test_styles_10, test_related_1 } = require('./test_data.js')

const port = process.env.PORT || 3000;
const home = `/SDC-Peach`
const API = `http://localhost:${port}${home}`

// jest.setTimeout(20000);

describe('SDC-Peach Product API Service', () => {
  const id = {
    product_id: 10
  }

  test('Should retrieve product id 10 from API', () => {
    axios.get(`${API}/products/${id.product_id}`, {
      params: {
        product_id: 10
      }
    })
      .then(res => {
        expect(res.data.id).toEqual(test_product_10.id);
        expect(res.data.name).toEqual(test_product_10.name);
      });
  });

  test('Should retrieve styles of product id 10 from API', () => {
    axios.get(`${API}/products/${id.product_id}/styles`, {
      params: {
        product_id: 10
      }
    })
      .then(res => {
        expect(res.data.product_id).toEqual(test_styles_10.id);
        expect(res.data.results).toEqual(test_styles_10.results);
      });
  });

  test('Should retrieve related items of product id 10 from API', () => {
    axios.get(`${API}/products/1/related`, {
      params: {
        product_id: 1
      }
    })
      .then(res => {
        expect(res.data).toEqual(test_related_1);
      });
  });

});
