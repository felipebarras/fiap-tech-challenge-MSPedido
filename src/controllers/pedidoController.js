const express = require('express');
const { criarPedido, listarPedidos, buscarPedido } = require('../services/pedidoServices');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const pedido = await criarPedido(req.body);
    console.log(`Pedido criado com sucesso: ${pedido}`);

    res.status(201).json(pedido);
  } catch (err) {
    console.error(`Erro ao criar pedido: ${err.message}`);
    res.status(500).json({ message: 'Erro ao criar pedido' });
  }
});

router.get('/', async (req, res) => {
  try {
    const pedidos = await listarPedidos();

    res.status(200).json(pedidos);
  } catch (err) {
    console.error(`Erro ao listar pedidos: ${err.message}`);
    res.status(500).json({ message: 'Erro ao listar pedidos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await buscarPedido(req.params.id);

    pedido ? res.json(pedido) : res.status(404).json({ message: 'Pedido não encontrado' });
  } catch (err) {
    console.error(`Erro ao buscar pedido: ${err.message}`);
    res.status(500).json({ message: 'Erro ao buscar pedido' });
  }
});

router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const pedido = await atualizarStatus(req.params.id, status);

  pedido ? res.json(pedido) : res.status(404).json({ message: 'Pedido não encontrado' });
});

module.exports = router;
