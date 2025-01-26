const PedidoRepositoryPort = require('../../core/application/ports/PedidoRepositoryPort');
const { ObjectId } = require('mongodb');

class MongoPedidoRepository extends PedidoRepositoryPort {
  constructor(database) {
    super();
    if (!database) throw new Error('Database connection not provided');
    this.database = database;
  }

  async criarPedido(pedido) {
    try {
      pedido.id = new ObjectId().toHexString();
      await this.database.collection('pedidos').insertOne(pedido);

      return { ...pedido };
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
      return await this.database.collection('pedidos').findOne({ id });
    } catch (err) {
      throw new Error(`Erro ao buscar pedido por ID: ${err}`);
    }
  }

  async deletarPedidoPorId(id) {
    try {
      const result = await this.database.collection('pedidos').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) throw new Error('Pedido não encontrado');

      return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
    } catch (err) {
      throw new Error(`Erro ao deletar pedido por ID: ${err}`);
    }
  }

  async limparPedidos() {
    try {
      const result = await this.database.collection('pedidos').deleteMany({});

      return { aknowledged: result.aknowledged, deletedCount: result.deletedCount };
    } catch (err) {
      throw new Error(`Erro ao limpar banco: ${err}`);
    }
  }
}

module.exports = MongoPedidoRepository;
