class PedidoRepositoryPort {
  async criarPedido(pedido) {
    throw new Error('Método não implementado');
  }

  async listarPedidos() {
    throw new Error('Método não implementado');
  }

  async buscarPedidoPorId(id) {
    throw new Error('Método não implementado');
  }

  async integrarComOutraAPI(apiURL) {
    throw new Error('Método não implementado');
  }
}

module.exports = PedidoRepositoryPort;
