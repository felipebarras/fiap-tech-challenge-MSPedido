const express = require('express');
const { criarPedido, listarPedidos, buscarPedido, atualizarStatus } = require('../services/pedidoServices');
const router = express.Router();

router.post('/', async (req, res) => {
  const { cliente, itens } = req.body;
  if (!cliente || !itens || itens.length === 0) return res.status(400).json({ message: 'Clientes e itens sâo obrigatórios' });

  try {
    const pedido = criarPedido({ cliente, itens });
    res.status(201).json(pedido);
  } catch (err) {
    console.error(`Erro ao criar pedido: ${err}`);
    res.status(500).json({ message: 'Erro ao criar pedido' });
  }
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
