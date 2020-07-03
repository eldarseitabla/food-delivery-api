CREATE TABLE IF NOT EXISTS restaurant (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL,
  picture       VARCHAR(255)    NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO restaurant (name, picture)
    VALUES ('Mario', 'some_pic_mario'),
        ('Avalon', 'some_pic_avalon'),
        ('Renaissance', 'some_pic_renaissance');

CREATE TABLE IF NOT EXISTS courier (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO courier (name)
    VALUES ('William'), ('Jack'), ('Oliver');

CREATE TABLE IF NOT EXISTS product (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name              VARCHAR(255)    NOT NULL,
  price             DECIMAL(13,2)   NOT NULL,
  description       VARCHAR(255)    NOT NULL,
  picture           VARCHAR(255)    NOT NULL,
  restaurant_id     BIGINT(20)      NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  INDEX restaurant_id_idx (restaurant_id),
  FOREIGN KEY (restaurant_id)
    REFERENCES restaurant(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO product (name, price, description, picture, restaurant_id)
    VALUES ('Cheeseburger', 110.50, 'The cheeseburger became popular in the 1920s and 1930s.', 'pic_cheeseburger', 1),
    ('Reuben sandwich', 189.30, 'Corned beef, swiss cheese, sauerkraut and Russian dressing the ultimate combination for the Reuben sandwich.', 'pic_reuben-sandwich', 1),
    ('Hot dog', 60.01, 'Hot dogs are a staple of American street food sold at carts and stands across the country.', 'pic_hot-dog', 1);
INSERT INTO product (name, price, description, picture, restaurant_id)
    VALUES ('Philly cheese steak', 145, 'Philly cheese steak has famous fans including former President Barack Obama.', 'pic_philly-cheese-steak', 2),
    ('Nachos', 80.40, 'A Northern Mexican snack which has become a firm favorite North of the border.', 'pic_nachos', 2),
    ('Chicago-style pizza', 380.99, 'Deep dish pizza is a Chicago speciality.', 'pic_shicago-style-pizza', 2);
INSERT INTO product (name, price, description, picture, restaurant_id)
    VALUES ('Delmonico''s steak', 500.96, 'The famous Delmonico''s where the steak magic happens.', 'pic_delmonicos', 3),
    ('Blueberry cobbler', 250.54, 'Cobblers emerged in the British American colonies and remain beloved today.', 'pic_blueberry_cobbler', 3),
    ('Chocolate-chip cookies', 220, 'The chocolate chip cookie was invented by American chef Ruth Graves Wakefield in 1938.', 'pic_chocolate-chip-cookies', 3);

CREATE TABLE IF NOT EXISTS customer (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)     NOT NULL,
  address       VARCHAR(255)     NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO customer (name, address)
    VALUES ('David', 'C address'),
        ('Ryan', 'H address'),
        ('Nathan', 'U address'),
        ('Sophia', 'K address'),
        ('William', 'P address'),
        ('Olivia', 'A address');

CREATE TABLE IF NOT EXISTS `order` (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  customer_id       BIGINT(20)       NOT NULL,
  payment_status    ENUM('notPaid', 'paid', 'paymentUponReceipt') NOT NULL,
  status            ENUM('created', 'active', 'inProgress', 'done', 'canceled') NOT NULL,
  address           VARCHAR(255)    NOT NULL,
  created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP       NOT NULL DEFAULT NOW() ON UPDATE now(),
  INDEX customer_id_idx (customer_id),
  FOREIGN KEY (customer_id)
    REFERENCES customer(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `order` (customer_id, payment_status, status, address)
    VALUES (1, 'notPaid', 'created', 'C address'),
        (5, 'paid', 'active', 'P address'),
        (4, 'paid', 'active', 'K address'),
        (2, 'paid', 'active', 'H address'),
        (3, 'paid', 'active', 'U address'),
        (4, 'paid', 'active', 'K address'),
        (6, 'paid', 'active', 'A address'),
        (5, 'paid', 'active', 'P address'),
        (4, 'paid', 'active', 'K address'),
        (3, 'paid', 'active', 'U address'),
        (2, 'paid', 'active', 'H address'),
        (4, 'paid', 'active', 'K address'),
        (3, 'paid', 'active', 'U address');

CREATE TABLE IF NOT EXISTS order_item (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  order_id          BIGINT(20)      NOT NULL,
  product_id        BIGINT(20)      NOT NULL,
  price             DECIMAL(13,2)   NOT NULL,
  created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP       NOT NULL DEFAULT NOW() ON UPDATE now(),
  INDEX order_id_idx (order_id),
  INDEX product_id_idx (product_id),
  FOREIGN KEY (order_id)
    REFERENCES `order`(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id)
    REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO order_item (order_id, product_id, price)
    VALUES (1, 1, 110.50),
        (1, 2, 189.30),
        (2, 3, 60.01),
        (2, 4, 145),
        (3, 5, 80.40),
        (3, 6, 380.99),
        (4, 7, 500.96),
        (4, 8, 250.54),
        (5, 9, 220),
        (5, 3, 60.01),
        (6, 5, 80.40),
        (6, 7, 500.96),
        (7, 2, 189.30),
        (7, 3, 60.01),
        (8, 4, 145),
        (8, 6, 380.99),
        (9, 8, 250.54),
        (9, 9, 220),
        (10, 6, 380.99),
        (10, 7, 500.96),
        (11, 3, 60.01),
        (11, 5, 80.40),
        (12, 7, 500.96),
        (12, 2, 189.30),
        (13, 6, 380.99),
        (13, 8, 250.54);

CREATE TABLE IF NOT EXISTS courier_order (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  courier_id    BIGINT(20)         NOT NULL,
  order_id      BIGINT(20)         NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
  INDEX courier_id_idx (courier_id),
  FOREIGN KEY (courier_id)
    REFERENCES courier(id) ON DELETE CASCADE,
  INDEX order_id_idx (order_id),
  FOREIGN KEY (order_id)
    REFERENCES `order`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO courier_order (courier_id, order_id)
    VALUES (2, 3),
        (2, 6),
        (2, 9),
        (2, 12),
        (1, 5),
        (1, 10),
        (1, 13),
        (3, 4),
        (3, 11),
        (1, 2),
        (1, 8),
        (3, 7);
