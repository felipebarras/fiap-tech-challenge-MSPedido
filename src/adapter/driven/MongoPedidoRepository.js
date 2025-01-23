const PedidoRepositoryPort = require('../../core/application/ports/PedidoRepositoryPort');

class MongoPedidoRepository extends PedidoRepositoryPort {
  constructor(database) {
    super();
    this.collection = database.collection('pedidos');
  }

  async salvarPedido(pedido) {
    const result = await this.collection.insertOne(pedido);

    return result.ops[0];
  }

  async listarPedidos() {
    return await this.collection.find().toArray();
  }

  async buscarPedidoPorId(id) {
    return await this.collection.findOne({ id });
  }

  async integrarComOutraAPI(apiURL) {
    // const response = await fetch(apiURL);
    // const data = await response.json();

    // return data;
    return `Integração mockada com sucesso para os dados: ${JSON.stringify(apiURL)}`;
  }
}

module.exports = MongoPedidoRepository;
