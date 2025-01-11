const express = require('express');
const router = express.Router();
const pedidoService = require('../services/pedidoServices');

router.post('/', async (req, res) => {
  const pedido = await pedidoService.criarPedido(req.body);

  // Retorna o evento pedido para Produção
  res.status(201).json(pedido);
});

router.get('/:id', async (req, res) => {
  const pedido = await pedidoService.buscarPedido(req.params.id);

  if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });

  res.json(pedido);
});

module.exports = router;
