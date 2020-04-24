# Datafiniti to Shopify CSV Generator

## ABOUT

Using datafinit.co to get product info and modifying JSON output for Shopify CSV upload

## Install dependencies / Start Up

```
npm i
nodemon server.js
```

## How To Use

## see postman collections from datafinity, specifically

- POST - https://api.datafiniti.co/v4/products/search - to return data from datafiniti
- POST - https://api.datafiniti.co/v4/views - to build query view used in above endpoint for Shopify import
- add query reponse to rawdata.json
- view DataFinity Search Folder or CustomSearch Folder for a list of queries that will get data from DataFinity

### use localhost:5000, create endpoint collection on your end to run. Endpoint on local machine.

- GET - {{URL}}/api/v1/datafiniti - outputs clean data
- CSV output can be modifying by changing utils/rawToCleanData.js file
- CSV output stored in results folder each time query is run with unique datetime file name
- CSV output can be directly uploaded to shopify using Shopify import user interface

### Go To <Your Shopify URL>/admin/products

- import products
- leave unchecked option
- Filter for unavailable your store
-

For more info please contact me via my website Aquasar.io
