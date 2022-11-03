DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(255) NOT NULL,
  default_price VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
)

