const PedidoRepositoryPort = require('../../core/application/ports/PedidoRepositoryPort');

class MongoPedidoRepository extends PedidoRepositoryPort {
  constructor(database) {
    super();
    this.database = database;
  }

  async salvarPedido(pedido) {
    return this.database.collection('pedidos').insertOne(pedido);
  }

  async listarPedidos() {
    return await this.database.collection('pedidos').find().toArray();
  }

  async buscarPedidoPorId(id) {
    return await this.database.collection('pedidos').findOne({ id });
  }
}

module.exports = MongoPedidoRepository;
