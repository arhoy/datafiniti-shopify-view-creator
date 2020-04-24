const slugify = require('slugify');

const findAvgPrice = require('./findAvgPrice');

const LIST_PRICE_MARKUP = 1.15;
const COMPARE_PRICE_MARKUP = 1.25;

const CANADA_CURRENCY = 1.3;

// get rawData from data finity and turn into clean data
// UTIL FUNCTION THAT HANDLES WHAT GOES INTO THE CLEAN DATA
const rawToCleanData = data => {
  let productObj = {},
    productArr = [];

  data.forEach((item, i) => {
    productObj.title = item.Title;
    const color = item.colors && item.colors.length ? item.colors[0] : '';
    const size = item.sizes && item.sizes.length ? item.sizes[0] : '';
    // const title = `${item.Title} ${color} ${size}`;

    productArr.push({
      Handle: slugify(item.Title, { replacement: '-', lower: true }),
      Title: item.Title,
      'Body (HTML)': item.descriptions[0].value,
      Vendor: item.Vendor,
      Type: item.Type.toString(),
      Tags:
        item.Tags.toString() +
        `,datafiniti, ${item.Vendor &&
          item.Vendor.toLowerCase()}, ${item.sourceURLs.toString()}`,
      Published: 'false',
      // 'Option1 Name': size ? 'Size' : '',
      // 'Option1 Value': size,
      // 'Option2 Name': color ? 'Color' : '',
      // 'Option2 Value': color,
      // 'Option3 Name': '',
      // 'Option3 Value': '',
      'Variant SKU': item.id,
      'Variant Grams': 0,
      'Variant Inventory Tracker': 'shopify',
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': Math.round(
        findAvgPrice(item.prices) * LIST_PRICE_MARKUP * CANADA_CURRENCY,
        2,
      ),
      'Variant Compare At Price': Math.round(
        Math.round(
          findAvgPrice(item.prices) * COMPARE_PRICE_MARKUP * CANADA_CURRENCY,
          2,
        ),
      ),
      'Variant Requires Shipping': 'TRUE',
      'Image Src': item.imageURLs[0],
      'Image Position': '',
      'Image Alt Text': item.Title,
      'Gift Card': '',
      'SEO Title': '',
      'SEO Description': '',
      'Variant Weight Unit': 'kg',
      'Cost per item': Math.round(
        findAvgPrice(item.prices) * CANADA_CURRENCY,
        2,
      ),
    });
  });

  return productArr;
};

module.exports = rawToCleanData;
