# food-delivery-api

## Create DB
```bash
cd ./dev
docker-compose -f docker-compose.yml up -d
```

## Install & Start
```bash
cd food-delivery-api
npm i
npm start
```

## Migrate
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
