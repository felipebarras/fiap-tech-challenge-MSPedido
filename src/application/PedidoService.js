class PedidoService {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async criarPedido(data) {
    const pedido = new Pedido(data.cliente, data.itens);
    return await this.pedidoRepository.salvarPedido(pedido);
  }

  async listarPedidos() {
    return await this.pedidoRepository.listarPedidos();
  }

  async buscarPedidosPorID(id) {
    return await this.pedidoRepository.buscarPedidosPorID(id);
  }
}

module.exports = PedidoService;
