require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/pedidos_db',
  port: process.env.PORT || 3000,
  customerURI: process.env.CUSTOMER_API_URI,
  productURI: process.env.PRODUCT_API_URI
};
