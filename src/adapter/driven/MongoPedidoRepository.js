const PedidoRepositoryPort = require('../../core/application/ports/PedidoRepositoryPort');

class MongoPedidoRepository extends PedidoRepositoryPort {
  constructor(database) {
    super();
    if (!database) throw new Error('Database connection not provided');
    this.database = database;
  }

  async criarPedido(pedido) {
    try {
      console.log(`Banco de dados: ${this.database}`);
      return await this.database.collection('pedidos').insertOne(pedido);
    } catch (err) {
      throw new Error(`Erro ao criar pedido: ${err}`);
    }
  }

  async listarPedidos() {
    try {
      console.log(`Banco de dados: ${this.database}`);
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

  async integrarComOutraAPI(apiURL) {
    try {
      console.log(`Integrando com a API externa: ${apiURL}`);
      return `Integração mockada com sucesso para os dados: ${JSON.stringify(apiURL)}`;
    } catch (err) {
      throw new Error(`Erro ao integrar com outra API: ${err}`);
    }
  }
}

module.exports = MongoPedidoRepository;
