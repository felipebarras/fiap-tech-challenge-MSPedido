const PedidoService = require('../../core/application/PedidoService');
const MongoPedidoRepository = require('../driven/MongoPedidoRepository');
const PedidoAPIAdapter = require('../driven/PedidoAPIAdapter');
const express = require('express');
const router = express.Router();

const pedidoRepository = new MongoPedidoRepository();
const pedidoAPIAdapter = new PedidoAPIAdapter('https://api-externa.com');
const pedidoService = new PedidoService(pedidoRepository, pedidoAPIAdapter);

router.get('/', async (req, res) => {
  try {
    const pedidos = await pedidoService.listarPedidos();

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const novoPedido = await pedidoService.criarPedido(req.body);

    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await pedidoService.buscarPedidoPorId(req.params.id);

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

router.post('/integrar', async (req, res) => {
  try {
    const resultado = await pedidoService.integrarComOutraAPI(req.body);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao integrar com outra API' });
  }
});

module.exports = router;
