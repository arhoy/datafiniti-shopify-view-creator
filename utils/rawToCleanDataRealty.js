const slugify = require('slugify');

const rawToCleanData = data => {
  let dataObj = {},
    dataArr = [];

  data.forEach((item, i) => {
    // define data title
    dataObj.title = `${item.numBedroom} bedroom ${item.numBathroom} bathroom ${item.address}`;
    // define data seo title
    dataObj.seoTitle = `${item.numBedroom} bedroom ${
      item.numBathroom
    } bathroom ${item.address} ${item.city} ${item.province} ${
      item.postalCode
    } listed at $${item.prices[0] && item.prices[0].amountMax} CDN`;
    // define featured listings
    dataObj.similarListings = item.features[1].key;

    dataArr.push({
      Handle: slugify(dataObj.title, { replacement: '-', lower: true }),
      Address: item.address,
      Brokers_agent:
        item.brokers && item.brokers[0] && item.brokers[0].agent
          ? item.brokers[0].agent
          : '-',
      Brokers_phone:
        item.brokers && item.brokers[0] && item.brokers[0].phones
          ? item.brokers[0].phones
          : '-',
      Brokers_company:
        item.brokers && item.brokers[0] && item.brokers[0].company
          ? item.brokers[0].company
          : '-',
      city: item.city,
      parking: item.parking ? item.parking[0] : '-',
      country: item.country,
      dateAdded: item.dataAdded,
      dateUpdated: item.dateUpdated,
      // descriptions: item.descriptions[0].value,
      features: item.features,
      floorSize: item.floorSizeValue,
      floorSize: item.floorSizeUnit,
      imageUrls: item.imageURLs,
      // mainImage: item.imageURLs && item.imageURLs[0],
      latituide: item.latitude,
      longitude: item.longitude,
      status: item.mostRecentStatus,
      mlsNumber: item.mlsNumber,
      nearbySchools: item.nearbySchools,
      numBathroom: item.numBathroom,
      numBedroom: item.numBedroom,
      postalCode: item.postalCode,
      currentListedPrice: item.prices[0] ? item.prices[0].amountMax : 0,
      priceCurrency:
        item.prices[0] && item.prices[0].pricePerSquareFoot
          ? item.prices[0].pricePerSquareFoot
          : '-',
      currency:
        item.prices[0] && item.prices[0].currency
          ? item.prices[0].currency
          : '-',
      propertyType: item.propertyType,
      sourceUrls: item.sourceUrls,
      id: item.id,
    });
  });

  return dataArr;
};

module.exports = rawToCleanData;
