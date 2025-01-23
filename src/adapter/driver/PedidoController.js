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
  '';

  async buscarPedidoPorId(req, res, next) {
    try {
      const pedidoId = req.params.id;
      const pedido = await this.pedidoService.buscarPedidoPorId(pedidoId);

      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async integrarComOutraAPI(req, res, next) {
    try {
      const resultado = await this.pedidoService.integrarComOutraAPI(req.body);

      res.status(200).json({ message: 'Integração realizada com sucesso', resultado });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PedidoController;
