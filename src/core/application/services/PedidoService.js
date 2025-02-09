const { json } = require('body-parser');
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
      console.log(`Criando pedido para o cliente: ${pedido.clienteCPF}`);
      const cliente = await this.customerAPI.buscarClientePorCPF(pedido.clienteCPF);
      if (!cliente) throw new Error('Cliente não encontrado');
      console.log(`Cliente encontrado: ${JSON.stringify(cliente)}`);

      console.log('Verificando produtos do pedido...');

      const dadosDosItens = [];
      let totalCompra = 0;

      for (const item of pedido.itens) {
        const produto = await this.produtoAPI.consultarPorId(item.produtoId);

        if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);

        dadosDosItens.push({
          produtoId: item.produtoId,
          nome: produto.nome,
          descricao: produto.descricao,
          categoria: produto.categoria,
          preco: produto.preco,
          quantidade: item.quantidade
        });
        totalCompra += produto.preco * item.quantidade;
      }

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
      };

      const novoPedido = {
        clienteCPF: pedido.clienteCPF,
        itens: dadosDosItens,
        status: pedido.status,
        total: totalCompra,
        criadoEm: formatDate(new Date())
      };

      console.log(`Produtos encontrados! Novo pedido criado: ${JSON.stringify(novoPedido)}`);

      return await this.mongoDbRepository.criarPedido(novoPedido);
    } catch (err) {
      throw new Error(`Erro ao criar pedido: ${err}`);
    }
  }

  async listarPedidos() {
    try {
      const pedidos = await this.mongoDbRepository.listarPedidos();
      !pedidos ? console.log('Nenhum pedido encontrado') : console.log(`Pedidos encontrados: ${JSON.stringify(pedidos)}`);

      return pedidos;
    } catch (err) {
      throw new Error(`Erro ao listar pedidos: ${err}`);
    }
  }

  async buscarPedidoPorId(pedidoId) {
    try {
      const pedido = await this.mongoDbRepository.buscarPedidoPorId(pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      throw new Error(`Erro ao buscar pedido por ID: ${err.message}`);
    }
  }

  async deletarPedidoPorId(pedidoId) {
    try {
      const pedido = await this.mongoDbRepository.deletarPedidoPorId(pedidoId);
      if (pedido.deletedCount === 0) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      throw new Error(`Erro ao deletar pedido por ID: ${err.message}`);
    }
  }

  async limparBancoDeDados() {
    try {
      const result = await this.mongoDbRepository.limparBancoDeDados();
      console.log(`${result.deletedCount} registros excluídos`);

      return result;
    } catch (err) {
      throw new Error(`Erro ao limpar pedidos: ${err.message}`);
    }
  }

  async atualizarStatusPedido(pedidoId, novoStatus) {
    try {
      const pedido = await this.mongoDbRepository.buscarPedidoPorId(pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      const atualizado = await this.mongoDbRepository.atualizarPedido(pedidoId, novoStatus);

      return atualizado;
    } catch (err) {
      throw new Error(`Erro ao atualizar status do pedido: ${err.message}`);
    }
  }
}

module.exports = PedidoService;
