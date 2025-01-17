class PedidoGateway {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async salvarPedido(pedido) {
    const pedidoDB = {
      cliente: pedido.cliente,
      itens: pedido.itens,
      status: pedido.status,
      criadoEm: pedido.criadoEm
    };

    return await this.pedidoRepository.salvarPedido(pedido);
  }

  async listarPedidos() {
    return await this.pedidoRepository.listarPedidos();
  }

  async buscarPedidoPorID(id) {
    return await this.pedidoRepository.buscarPedidosPorID(id);
  }
}

module.exports = PedidoGateway;
