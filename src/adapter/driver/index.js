const express = require('express');
const PedidoService = require('../../core/application/services/PedidoService');
const MongoPedidoRepository = require('../driven/MongoPedidoRepository');
const PedidoController = require('./PedidoController');
const database = require('../driven/database');

const app = express();
app.use(express.json());

const pedidoRepository = new MongoPedidoRepository(database);
const pedidoService = new PedidoService(pedidoRepository);

app.use('/pedidos', PedidoController(pedidoService));

module.exports = app;
