const PedidoService = require('../../core/application/services/PedidoService');
const MongoPedidoRepository = require('../driven/MongoPedidoRepository');
const PedidoController = require('./PedidoController');
const database = require('../driven/database');
const swaggerDocument = require('../../swagger/swagger.json');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const app = express();
app.use(express.json());

const pedidoRepository = new MongoPedidoRepository(database);
const pedidoService = new PedidoService(pedidoRepository);

// integração do Swagger
app.use('/api/v1/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rotas da API
app.use('/api/v1/pedidos', PedidoController(pedidoService));

// Middleware para lidar com erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

module.exports = app;
