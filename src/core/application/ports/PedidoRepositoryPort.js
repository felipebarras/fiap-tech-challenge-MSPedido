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

  async deletarPedidoPorId(id) {
    throw new Error('Método não implementado');
  }

  async limparBancoDeDados() {
    throw new Error('Método não implementado');
  }

  async atualizarStatusPedido(pedidoId, novoStatus) {
    throw new Error('Método não implementado');
  }
}

module.exports = PedidoRepositoryPort;
