const express = require('express');
const { criarPedido, listarPedidos, buscarPedido, atualizarStatus } = require('../services/pedidoServices');
const router = express.Router();

router.post('/', async (req, res) => {
  const { cliente, itens } = req.body;
  const pedido = criarPedido({ cliente, itens });
  res.status(201).json(pedido);
});

router.get('/', async (req, res) => {
  const pedidos = await listarPedidos();
  res.status(200).json(pedidos);
});

router.get('/:id', async (req, res) => {
  const pedido = await buscarPedido(req.params.id);
  pedido ? res.json(pedido) : res.status(404).json({ message: 'Pedido não encontrado' });
});

router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const pedido = await atualizarStatus(req.params.id, status);

  pedido ? res.json(pedido) : res.status(404).json({ message: 'Pedido não encontrado' });
});

module.exports = router;
