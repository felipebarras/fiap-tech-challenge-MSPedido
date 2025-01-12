const express = require('express');
const pedidoController = require('./controllers/pedidoController');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/pedidos', pedidoController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Microsserviço rodando na porta ${PORT}`);
});
