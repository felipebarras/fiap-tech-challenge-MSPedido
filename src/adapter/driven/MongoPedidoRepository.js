const PedidoRepositoryPort = require('../../core/application/ports/PedidoRepositoryPort');

class MongoPedidoRepository extends PedidoRepositoryPort {
  constructor(database) {
    super();
    if (!database) throw new Error('Database connection not provided');
    this.database = database;
  }

  async criarPedido(pedido) {
    try {
      return await this.database.collection('pedidos').insertOne(pedido);
    } catch (err) {
      throw new Error(`Erro ao criar pedido: ${err}`);
    }
  }

  async listarPedidos() {
    try {
      const pedidos = await this.database.collection('pedidos').find().toArray();

      return pedidos;
    } catch (err) {
      throw new Error(`Erro ao listar pedidos: ${err}`);
    }
  }

  async buscarPedidoPorId(id) {
    try {
      return await this.database.collection('pedidos').findOne({ _id: id });
    } catch (err) {
      throw new Error(`Erro ao buscar pedido por ID: ${err}`);
    }
  }
}

module.exports = MongoPedidoRepository;
