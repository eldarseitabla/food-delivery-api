# food-delivery-api

## Checklist
- [x] Launch server
- [x] Swagger
- [x] DB structure
- [x] Migrate & Fixtures
- [x] Mysql connect
- [x] Mysql Connection Pooling
- [x] CRUD & Swagger & Tests
    - [x] Restaurant
    - [x] Courier
    - [x] Product
    - [x] Customer
    - [x] Order
    - [x] OrderItem
    - [x] CourierOrder
- [ ] Business-logic
    - [x] Create order
    - [x] Courier order
    - [x] Where did the courier most often was
    - [x] How many orders courier completed

## Install and Use

### Env
```bash
cp ./.env.example ./.env
```

### API Docs
API Docs
[http://127.0.0.1:5000/api-docs](http://127.0.0.1:5000/api-docs)

OpenAPI spec
[http://127.0.0.1:5000/openapi.json](http://127.0.0.1:5000/openapi.json)


### Create DB via Docker
```bash
cd ./dev && docker-compose -f docker-compose.yml up -d
```

### Install & Start
```bash
cd ../food-delivery-api
npm i
npm start
```

### Migrate
Create migration
```bash
npm run migrate:create some_migration
```
Create migration with sql files
```bash
npm run migrate:create some_migration --sql-file
```
Up
```bash
npm run migrate:up
```
Down
```bash
npm run migrate:down
```
