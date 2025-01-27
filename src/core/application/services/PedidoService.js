const { ObjectId } = require('mongodb');

class PedidoService {
  constructor(customerAPI, produtoAPI, mongoDbRepository) {
    this.customerAPI = customerAPI;
    this.produtoAPI = produtoAPI;
    this.mongoDbRepository = mongoDbRepository;
  }

  async criarPedido(pedido) {
    try {
      // validando o cliente
      // console.log(`Criando pedido para o cliente: ${pedido.clienteCPF}`);
      // const cliente = await this.customerAPI.buscarClientePorCPF(pedido.clienteCPF);
      // if (!cliente) throw new Error('Cliente não encontrado');
      // console.log(`Cliente encontrado: ${JSON.stringify(cliente)}`);

      // // validando produtos
      // for (const item of pedido.itens) {
      //   const produto = await this.produtoAPI.consultarPorId(item.produtoId);
      //   if (!produto) throw new Error('Produto não encontrado');
      // }

      return await this.mongoDbRepository.criarPedido(pedido);
    } catch (err) {
      console.error(`Erro ao criar pedido: ${err}`);
      throw new Error(`Erro ao criar pedido`);
    }
  }

  async listarPedidos() {
    try {
      const pedidos = await this.mongoDbRepository.listarPedidos();
      !pedidos ? console.log('Nenhum pedido encontrado') : console.log(`Pedidos encontrados: ${JSON.stringify(pedidos)}`);

      return pedidos;
    } catch (err) {
      console.error(`Erro ao listar pedidos: ${err}`);
      throw new Error(`Erro ao listar pedidos`);
    }
  }

  async buscarPedidoPorId(pedidoId) {
    try {
      const pedido = await this.mongoDbRepository.buscarPedidoPorId(pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      console.error(`Erro ao buscar pedido por ID: ${err}`);
      throw new Error(`Erro ao buscar pedido por ID: ${err.message}`);
    }
  }

  async deletarPedidoPorId(pedidoId) {
    try {
      const pedido = await this.mongoDbRepository.deletarPedidoPorId(pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      console.error(`Erro ao deletar pedido por ID: ${err}`);
      throw new Error(`Erro ao deletar pedido por ID: ${err.message}`);
    }
  }

  async limparBancoDeDados() {
    try {
      const result = await this.mongoDbRepository.limparBancoDeDados();
      console.log(`${result.deletedCount} registros excluídos`);

      return result;
    } catch (err) {
      console.error(`Erro ao limpar pedidos: ${err}`);
      throw new Error(`Erro ao limpar pedidos`);
    }
  }

  async atualizarStatusPedido(pedidoId, novoStatus) {
    try {
      const pedido = await this.mongoDbRepository.buscarPedidoPorId(pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      const atualizado = await this.mongoDbRepository.atualizarPedido(pedidoId, novoStatus);

      return atualizado;
    } catch (err) {
      console.error(`Erro ao atualizar status do pedido: ${err}`);
      throw new Error(`Erro ao atualizar status do pedido`);
    }
  }
}

module.exports = PedidoService;
