const swaggerDocument = require('../../swagger/swagger.json');

const swaggerMiddleware = (req, res, next) => {
  const protocol = req.protocol; // "http" or "https"
  const host = req.get('host'); // Current host (e.g., "yourdomain.com")

  swaggerDocument.servers = [
    {
      url: `${protocol}://${host}/api/v1`,
      description: 'Current Server'
    }
  ];

  next();
};

module.exports = swaggerMiddleware;
