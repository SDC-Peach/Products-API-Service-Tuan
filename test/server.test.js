const axios = require('axios')
const { test_product_10, test_styles_10, test_related_1, test_related_2 } = require('./test_data.js')

const port = process.env.PORT || 3000;
const home = `/SDC-Peach`
const API = `http://localhost:${port}${home}`

// jest.setTimeout(20000);

describe('SDC-Peach Product API Service', () => {
  const id = {
    product_id: 10
  }

  test('Should retrieve infinity stones from API', () => {
    axios.get(`${API}/products/${id.product_id}`, {
      params: {
        product_id: 10
      }
    })
      .then(res => {
        expect(res.data.id).toEqual(10);
        expect(res.data.name).toEqual('Infinity Stone');
        expect(res.data.slogan).toEqual('Reality is often disappointing. That is, it was. Now, reality can be whatever I want.');
        expect(res.data.category).toEqual('Accessories');
        expect(res.data.default_price).toEqual('5000000');
      });
  });

  test('Should retrieve styles of product id 10 from API', () => {
    axios.get(`${API}/products/${id.product_id}/styles`, {
      params: {
        product_id: 10
      }
    })
      .then(res => {
        const stones = ['Reality', 'Space', 'Time', 'Power', 'Mind', 'Soul']
        let styles = res.data;
        expect(styles.id).toEqual(test_styles_10.id);
        expect(styles.results.length).toEqual(test_styles_10.results.length);
        for (let i = 0; i < styles.results.length; i++) {
          expect(styles.results[i].id).toEqual(test_styles_10.results[i].id)
          expect(styles.results[i].name).toEqual(stones[i])
        }
      });
  });

  test('Should retrieve related id\'s of product 1 and 2 from API', () => {
    axios.get(`${API}/products/1/related`, {
      params: {
        product_id: 1
      }
    })
      .then(res => {
        expect(res.data).toEqual(test_related_1);
      });

    axios.get(`${API}/products/2/related`, {
      params: {
        product_id: 2
      }
    })
      .then(res => {
        expect(res.data).toEqual(test_related_2);
      });
  });


});
