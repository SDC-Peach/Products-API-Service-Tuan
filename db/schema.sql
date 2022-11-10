DROP DATABASE IF EXISTS products;
CREATE DATABASE products;

\c products;

DROP TABLE IF EXISTS features, photos, product, related, skus, styles;

CREATE TABLE IF NOT EXISTS product (
  id INT,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(1000) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(255) NOT NULL,
  default_price VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS related (
  id INT,
  product_id INT,
  related_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES product(id)
);

CREATE TABLE IF NOT EXISTS features (
  feature_id INT,
  product_id INT NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY(feature_id),
  FOREIGN KEY(product_id) REFERENCES product(id)
);

CREATE TABLE IF NOT EXISTS styles (
  style_id INT,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  sale_price VARCHAR(255) NOT NULL,
  original_price INT NOT NULL,
  default_style BOOLEAN,
  PRIMARY KEY(style_id),
  FOREIGN KEY(product_id) REFERENCES product(id)
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id INT,
  style_id INT,
  url VARCHAR,
  thumbnail_url VARCHAR,
  PRIMARY KEY(photo_id),
  FOREIGN KEY(style_id) REFERENCES styles(style_id)
);

CREATE TABLE IF NOT EXISTS skus (
  id INT,
  style_id INT,
  size VARCHAR(50),
  quantity INT,
  PRIMARY KEY(id),
  FOREIGN KEY(style_id) REFERENCES styles(style_id)
);

CREATE INDEX related_product_id_index ON related (product_id);
CREATE INDEX features_product_id_index ON features (product_id);
CREATE INDEX styles_product_id_index ON styles (product_id);
CREATE INDEX photos_style_id_index ON photos (style_id);
CREATE INDEX skus_style_id_index ON skus (style_id);