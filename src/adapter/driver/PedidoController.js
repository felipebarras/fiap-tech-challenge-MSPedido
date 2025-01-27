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
      next(err);
    }
  }

  async listarPedidos(req, res, next) {
    try {
      const pedidos = await this.pedidoService.listarPedidos();

      res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }

  async buscarPedidoPorId(req, res, next) {
    try {
      const { id } = req.params;
      const pedido = await this.pedidoService.buscarPedidoPorId(id);

      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async deletarPedidoPorId(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.pedidoService.deletarPedidoPorId(id);

      if (result.deletedCount === 0) return res.status(404).json({ error: 'Pedido não encontrado' });

      res.status(200).json({ message: `Pedido com ID ${id} foi removido com sucesso`, ...result });
    } catch (err) {
      next(err);
    }
  }

  async limparBancoDeDados(req, res, next) {
    try {
      const result = await this.pedidoService.limparBancoDeDados();

      res.status(200).json({ message: 'Todos os pedidos foram removidos com sucesso', ...result });
    } catch (err) {
      next(err);
    }
  }

  async atualizarStatusPedido(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Aguardando Pagamento', 'Pendente', 'Preparando', 'Pronto', 'Entregue'].includes(status))
        return res.status(400).json({ message: 'Status Inválido' });

      const result = await this.pedidoService.atualizarStatusPedido(id, status);

      if (result.modifiedCount === 0) return res.status(404).json({ message: 'Pedido não encontrado' });

      return res.status(200).json({ message: `Status do pedido com ID ${id} foi atualizado para ${status}` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PedidoController;
