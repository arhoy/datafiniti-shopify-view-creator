# Datafiniti to Shopify CSV Generator AND DataFiniti To WordPress API Creator

## ABOUT SHOPIFY CSV Uploads

Using datafinit.co to get product info and modifying JSON output for Shopify CSV upload

### Install dependencies / Start Up

```
npm i
nodemon server.js
```

### How To Use

### see postman collections from datafinity, specifically

- **POST** - https://api.datafiniti.co/v4/products/search - to return data from datafiniti
- **POST** - https://api.datafiniti.co/v4/views - to build query view used in above endpoint for Shopify import
- add query reponse to rawdata.json
- view DataFinity Search Folder or CustomSearch Folder for a list of queries that will get data from DataFinity

#### use localhost:5000, create endpoint collection on your end to run. Endpoint on local machine.

- GET - {{URL}}/api/v1/datafiniti - outputs clean data. (URL variable is localhost url on your machine. See server.js file for PORT )

- CSV output can be modifying by changing utils/rawToCleanData.js file
- CSV output stored in results folder each time query is run with unique datetime file name
- CSV output can be directly uploaded to shopify using Shopify import user interface

#### Go To <Your Shopify URL>/admin/products

- import products
- leave unchecked option
- Filter for unavailable your store
-

For more info please contact me via my website Aquasar.io

## About the Realty Data

### Datafiniti Endpoint

**WHAT IT DOES**: Specify query in body (see below and see datafiniti documentation ) to output a array of property data formated as json or csv

**ENDPOINT** https://api.datafiniti.co/v4/properties/search

### Datafiniti Sample Query to JSON

```
{
"query": "mlsNumber:_ AND imageURLs:_ AND propertyType:(Apartment OR \"Apartment Building\" OR Apartments OR Condo OR \"Condo Building\" OR Flat OR Home OR House OR \"Single Family Dwelling\" OR Townhouse) AND city:(Edmonton) AND province:(AB) AND country:(CA) AND brokers.company:\"RE/MAX Elite\"",
"num_records":0,
"download":false,
"format":"JSON"
}
```

### CleanDataToCSVRealty

**WHAT IT DOES:** Turns data from above datafinit output into a output csv in the results folder on your computer.

The mapping is specified in utils folder -> rawToCleanDataRealty.js file

**WARNING:** Make sure to paste the query result from Postman into the rawdata.json in the \_data folder.

**ENDPOINT:** {{URL}}/api/v1/datafinitiRealty

**NOTE:** (URL variable is localhost url on your machine. See server.js file for PORT or use Port 5000 )

### Next Steps

1. CSV file is found in the results folder. You should see a new csv file generated each time you run the following endpoint
   {{URL}}/api/v1/datafinitiRealty

2. Take the CSV file and upload it to WordPress via using the WPALLIMPORT wordpress plugin with Advanced Custom Fields Installed.

3. Follow steps to import and map data into wordpress

4. If you are using Gatsby and WordPress as CMS only you should follow Gatsby WordPress Recipe and enable acf to true to graphql the data as needed
