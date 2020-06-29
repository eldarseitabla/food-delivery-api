# food-delivery-api

## Checklist
- [x] Launch server
- [x] Swagger
- [x] DB structure
- [x] Migrate & Fixtures
- [x] Mysql connect
- [ ] Mysql Connection Pooling
- [ ] CRUD & Swagger & Tests
    - [x] Restaurant
    - [ ] Courier
    - [ ] Product
    - [ ] Customer
    - [ ] Order
    - [ ] OrderItem
    - [ ] CourierOrder

## Install and Use

### Create DB via
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
