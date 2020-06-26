CREATE TABLE IF NOT EXISTS restaurant (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL,
  picture       VARCHAR(255)    NOT NULL,
  created_at    DATETIME        NOT NULL,
  updated_at    DATETIME        NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS courier (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL,
  created_at    DATETIME        NOT NULL,
  updated_at    DATETIME        NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS product (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  price             DECIMAL(18,2)   NOT NULL,
  name              VARCHAR(255)    NOT NULL,
  description       VARCHAR(255)    NOT NULL,
  picture           VARCHAR(255)    NOT NULL,
  restaurant_id     BIGINT(20)      NOT NULL,
  created_at        DATETIME        NOT NULL,
  updated_at        DATETIME        NOT NULL,
  INDEX restaurant_id_idx (restaurant_id),
  FOREIGN KEY (restaurant_id)
    REFERENCES restaurant(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS customer (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)     NOT NULL,
  address       VARCHAR(255)     NOT NULL,
  created_at    DATETIME         NOT NULL,
  updated_at    DATETIME         NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `order` (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  customer_id       BIGINT(20)          NOT NULL,
  name              VARCHAR(255)     NOT NULL,
  payment_status    ENUM('notPaid', 'paid', 'paymentUponReceipt') NOT NULL,
  status            ENUM('created', 'active', 'inProgress', 'done', 'canceled') NOT NULL,
  created_at        DATETIME        NOT NULL,
  updated_at        DATETIME        NOT NULL,
  INDEX customer_id_idx (customer_id),
  FOREIGN KEY (customer_id)
    REFERENCES customer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS order_item (
  id                BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  order_id          BIGINT(20)     NOT NULL,
  product_id        BIGINT(20)     NOT NULL,
  price             DECIMAL(18,2)   NOT NULL,
  created_at        DATETIME    NOT NULL,
  updated_at        DATETIME    NOT NULL,
  INDEX order_id_idx (order_id),
  INDEX product_id_idx (product_id),
  FOREIGN KEY (order_id) REFERENCES `order`(id),
  FOREIGN KEY (product_id)
    REFERENCES product(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS courier_order (
  id            BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  order_id      BIGINT(20)         NOT NULL,
  created_at    DATETIME        NOT NULL,
  updated_at    DATETIME        NOT NULL,
  INDEX order_id_idx (order_id),
  FOREIGN KEY (order_id) REFERENCES `order`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
