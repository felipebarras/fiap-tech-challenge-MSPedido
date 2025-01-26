class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  async criarPedido(req, res, next) {
    try {
      const novoPedido = req.body;
      const pedidoCriado = await this.pedidoService.criarPedido(novoPedido);

      res.status(201).json(pedidoCriado);
    } catch (err) {
      console.error(`Erro ao criar pedido: ${err.message}`);
      res.status(500).json({ error: 'Erro ao criar pedido' });

      next(err);
    }
  }

  async listarPedidos(req, res, next) {
    try {
      const pedidos = await this.pedidoService.listarPedidos();

      res.status(200).json(pedidos);
    } catch (err) {
      console.error(`Erro ao listar pedidos: ${err.message}`);
      res.status(500).json({ error: 'Erro ao listar pedidos' });

      next(err);
    }
  }

  async buscarPedidoPorId(req, res, next) {
    try {
      const pedidoId = req.params.id;
      const pedido = await this.pedidoService.buscarPedidoPorId(pedidoId);

      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

      res.status(200).json(pedido);
    } catch (err) {
      console.error(`Erro ao buscar pedido por ID: ${err.message}`);
      res.status(500).json({ error: 'Erro ao buscar pedido por ID' });

      next(err);
    }
  }

  async deletarPedidoPorId(req, res, next) {
    try {
      const { id } = req.params.id;
      const result = await this.pedidoService.deletarPedidoPorId(id);

      res.status(200).json({ message: `Pedido com ID ${id} foi removido com sucesso`, ...result });
    } catch (err) {
      console.error(`Erro ao deletar pedido por ID: ${err.message}`);
      res.status(500).json({ error: 'Erro ao deletar pedido por ID' });

      next(err);
    }
  }

  async limparBancoDeDados(req, res, next) {
    try {
      const result = await this.pedidoService.limparBancoDeDados();

      res.status(200).json({ message: 'Todos os pedidos foram removidos com sucesso', ...result });
    } catch (err) {
      console.error(`Erro ao limpar pedidos: ${err.message}`);
      res.status(500).json({ error: 'Erro ao deletar todos os pedidos' });

      next(err);
    }
  }
}

module.exports = PedidoController;
