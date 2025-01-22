const express = require('express');

function PedidoController(pedidoService) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const pedido = await pedidoService.criarPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const pedidos = await pedidoService.listarPedidos();
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos.' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const pedido = await pedidoService.buscarPedidoPorId(req.params.id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
      res.json(pedido);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
  });

  return router;
}

module.exports = PedidoController;
