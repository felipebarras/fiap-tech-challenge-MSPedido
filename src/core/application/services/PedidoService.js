class PedidoService {
  constructor(customerAPI, produtoAPI, mongoDbRepository) {
    this.customerAPI = customerAPI;
    this.produtoAPI = produtoAPI;
    this.mongoDbRepository = mongoDbRepository;
  }

  async criarPedido(pedido) {
    try {
      return await this.mongoDbRepository.criarPedido(pedido);
    } catch (err) {
      console.error(`Erro ao criar pedido: ${err}`);
      throw new Error(`Erro ao criar pedido`);
    }
  }

  async listarPedidos() {
    try {
      return await this.mongoDbRepository.listarPedidos();
    } catch (err) {
      console.error(`Erro ao listar pedidos: ${err}`);
      throw new Error(`Erro ao listar pedidos`);
    }
  }

  async buscarPedidoPorId(id) {
    try {
      const pedido = await this.mongoDbRepository.buscarPedidoPorId(id);
      if (!pedido) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      console.error(`Erro ao buscar pedido por ID: ${err}`);
      throw new Error(`Erro ao buscar pedido por ID`);
    }
  }

  async integrarComOutraAPI(data) {
    try {
      return await this.mongoDbRepository.integrarComOutraAPI(data);
    } catch (err) {
      console.error(`Erro ao comunicar com outra API: ${err}`);
      throw new Error(`Erro ao comunicar com outra API`);
    }
  }
}

module.exports = PedidoService;
