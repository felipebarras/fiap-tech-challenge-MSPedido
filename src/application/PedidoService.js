const Pedido = require('../domain/Pedido');

class PedidoService {
  constructor(pedidoGateway) {
    this.pedidoGateway = pedidoGateway;
  }

  async criarPedido(data) {
    const pedido = new Pedido(data.cliente, data.itens);
    return await this.pedidoGateway.salvarPedido(pedido);
  }

  async listarPedidos() {
    return await this.pedidoGateway.listarPedidos();
  }

  async buscarPedidoPorID(id) {
    const pedido = await this.pedidoGateway.buscarPedidoPorID(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    return pedido;
  }
}

module.exports = PedidoService;
