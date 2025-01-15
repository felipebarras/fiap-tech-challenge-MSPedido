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

  async buscarPedidosPorID(id) {
    return await this.pedidoGateway.buscarPedidosPorID(id);
  }
}

module.exports = PedidoService;
