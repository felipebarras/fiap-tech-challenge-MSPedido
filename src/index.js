const express = require('express');
const bodyParser = require('body-parser');
const pedidoController = require('./controllers/pedidoController');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/pedidos', pedidoController);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
