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
      pedido.pedidoId = new ObjectId().toHexString();
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

  async buscarPedidoPorId(pedidoId) {
    try {
      // console.log(`ID recebido para busca: ${pedidoId}`);

      const pedido = await this.database.collection('pedidos').findOne({ pedidoId });

      // console.log(`Pedido encontrado: ${JSON.stringify(pedido)}`);
      return pedido;
    } catch (err) {
      console.error(`Erro ao buscar pedido por ID: ${err}`);
      throw new Error(`Erro ao buscar pedido por ID: ${err.message}`);
    }
  }

  async deletarPedidoPorId(pedidoId) {
    try {
      const result = await this.database.collection('pedidos').deleteOne({ pedidoId });
      if (result.deletedCount === 0) throw new Error('Pedido não encontrado');

      return result;
    } catch (err) {
      throw new Error(`Erro ao deletar pedido por ID: ${err}`);
    }
  }

  async limparBancoDeDados() {
    try {
      const result = await this.database.collection('pedidos').deleteMany({});

      return { aknowledged: result.aknowledged, deletedCount: result.deletedCount };
    } catch (err) {
      throw new Error(`Erro ao limpar banco: ${err}`);
    }
  }

  async atualizarPedido(pedidoId, novoStatus) {
    try {
      const result = await this.database.collection('pedidos').updateOne({ pedidoId }, { $set: { status: novoStatus } });
      if (result.matchedCount === 0) throw new Error('Pedido não encontrado');

      return result;
    } catch (err) {
      throw new Error(`Erro ao atualizar pedido: ${err}`);
    }
  }
}

module.exports = MongoPedidoRepository;
