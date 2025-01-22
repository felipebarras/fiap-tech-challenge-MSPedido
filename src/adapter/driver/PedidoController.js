const express = require('express');

function PedidoController(pedidoService) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const pedidos = await pedidoService.listarPedidos();

      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const novoPedido = req.body;
      const pedidoCriado = await pedidoService.criarPedido(novoPedido);

      res.status(201).json(pedidoCriado);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const pedido = await pedidoService.buscarPedidoPorId(req.params.id);

      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  });

  router.get('/integrar/:apiURL', async (req, res) => {
    try {
      const resultado = await pedidoService.integrarComOutraAPI(req.params.apiURL);

      res.status(200).json({ message: 'Integração com outra API realizada com sucesso', resultado });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao integrar com outra API' });
    }
  });

  return router;
}

module.exports = PedidoController;
