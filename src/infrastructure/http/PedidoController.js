const express = require('express');

function PedidoController(pedidoService) {
  const router = express.Router();

  /**
   * @swagger
   * /pedidos:
   *   post:
   *     summary: Cria um novo pedido
   *     description: Cria um novo pedido com os dados fornecidos (cliente, itens e status inicial)
   *     tags:
   *       - Pedidos
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cliente:
   *                 type: string
   *               itens:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     produto:
   *                       type: string
   *                     quantidade:
   *                       type: integer
   *               status:
   *                 type: string
   *                 enum: [pendente, em_preparacao, pronto, entregue]
   *     responses:
   *       201:
   *         description: Pedido criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro ao criar pedido
   */

  router.post('/', async (req, res) => {
    try {
      const pedido = await pedidoService.criarPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  });

  /**
   * @swagger
   * /pedidos:
   *   get:
   *     summary: Lista os pedidos
   *     description: Retorna uma lista de todos os pedidos existentes
   *    responses:
   *      200:
   *       description: a lista de pedidos
   *       content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               type: object
   */

  router.get('/', async (req, res) => {
    try {
      const pedidos = await pedidoService.listarPedidos();
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos.' });
    }
  });

  /**
   * @swagger
   * /pedidos/{id}:
   *   get:
   *     summary: Buscar pedido por ID
   *     description: Retorna os detalhes de um pedido específico
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do pedido a ser buscado
   *     tags:
   *       - Pedidos
   *    responses:
   *      200:
   *       description: detalhes do pedido
   *      404:
   *       description: Pedido não encontrado
   *      500:
   *       description: Erro ao buscar pedido / no servidor
   */

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
