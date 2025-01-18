const { ObjectId } = require('mongodb');
const PedidoRepository = require('../../application/interfaces/PedidoRepository');

class MongoPedidoRepository extends PedidoRepository {
  constructor(db) {
    super();
    this.collection = db.collection('pedidos');
  }

  async salvarPedido(pedido) {
    const result = await this.collection.insertOne(pedido);
    return { ...pedido, _id: result.insertedId };
  }

  async listarPedidos() {
    return await this.collection.find().toArray();
  }

  async buscarPedidoPorId(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }
}

module.exports = MongoPedidoRepository;
