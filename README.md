# gatsby-with-MERN---Back

##

Backend API app
Rename config/config.env.env to config/config.env and update withour own values

## Install dependencies

```
npm i
```

## Run

```
nodemon server.js

### see postman collections from datafinity, specifically
 - POST - https://api.datafiniti.co/v4/products/search - to return data from datafiniti
 - POST - https://api.datafiniti.co/v4/views - to build query view used in above endpoint for Shopify import
 - add query reponse to rawdata.json

### use localhost:5000, create endpoint collection on your end to run. Endpoint on local machine.
 - GET - {{URL}}/api/v1/datafiniti - outputs clean data
 - CSV output can be modifying by changing utils/rawToCleanData.js file
 - CSV output stored in results folder each time query is run with unique datetime file name
 - CSV output can be directly uploaded to shopify using Shopify import user interface
```

For more info please contact me via my website Aquasar.io
