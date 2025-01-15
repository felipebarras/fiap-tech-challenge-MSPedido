const express = require('express');
const connectToMongo = require('../database/database');
const MongoPedidoRepository = require('../database/MongoPedidoRepository');
const PedidoGateway = require('../../application/adapters/PedidoGateway');
const PedidoService = require('../../application/PedidoService');
const PedidoController = require('./PedidoController');
const { port } = require('../../shared/env');

(async () => {
  const app = express();
  app.use(express.json());

  const db = await connectToMongo();
  const pedidoRepository = new MongoPedidoRepository(db);
  const pedidoGateway = new PedidoGateway(pedidoRepository);
  const pedidoService = new PedidoService(pedidoGateway);

  app.use('/pedidos', PedidoController(pedidoService));

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
})();
