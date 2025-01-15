const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microsserviço de Pedidos',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos de uma lanchonete'
    },
    servers: [
      {
        url: 'http:localhost:3000',
        description: 'Servidor de teste'
      }
    ]
  },
  apis: ['./src/infrastructure/http/PedidoController.js'] // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = { serve: swaggerUi.serve, setup: swaggerUi.setup(swaggerDocs) };
