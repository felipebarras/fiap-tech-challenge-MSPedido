const express = require('express');
const { port } = require('../../shared/env');
const pedidoController = require('./PedidoController');

const app = express();

app.use(express.json());
app.use('/pedidos', pedidoController);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
