const express = require('express');
const connectToMongo = require('../database/database');
const MongoPedidoRepository = require('../database/MongoPedidoRepository');
const PedidoGateway = require('../../application/adapters/PedidoGateway');
const PedidoService = require('../../application/PedidoService');
const PedidoController = require('./PedidoController');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../../swagger/swagger.json');
const { port } = require('../../shared/env');

(async () => {
  const app = express();
  app.use(express.json());

  //setando o swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  const db = await connectToMongo();
  const pedidoRepository = new MongoPedidoRepository(db);
  const pedidoGateway = new PedidoGateway(pedidoRepository);
  const pedidoService = new PedidoService(pedidoGateway);

  app.use('/pedidos', PedidoController(pedidoService));

  app.listen(port, () => {
    console.log(`Microsserviço de Pedido rodando na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
  });
})();
