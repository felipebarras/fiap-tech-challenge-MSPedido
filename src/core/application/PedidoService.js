const Pedido = require('../domain/Pedido');

class PedidoService {
  constructor(pedidoRepository, pedidoGatewayPort) {
    this.pedidoRepository = pedidoRepository; // comunicação com banco de dados
    this.pedidoGatewayPort = pedidoGatewayPort; // comunicação com APIs externas
  }

  async criarPedido(pedido) {
    try {
      return await this.pedidoRepository.criarPedido(pedido);
    } catch (err) {
      console.error(`Erro ao criar pedido: ${err}`);
      throw new Error(`Erro ao criar pedido`);
    }
  }

  async listarPedidos() {
    try {
      return await this.pedidoRepository.listarPedidos();
    } catch (err) {
      console.error(`Erro ao listar pedidos: ${err}`);
      throw new Error(`Erro ao listar pedidos`);
    }
  }

  async buscarPedidoPorId(id) {
    try {
      const pedido = await this.pedidoRepository.buscarPedidoPorId(id);
      if (!pedido) throw new Error('Pedido não encontrado');

      return pedido;
    } catch (err) {
      console.error(`Erro ao buscar pedido por ID: ${err}`);
      throw new Error(`Erro ao buscar pedido por ID`);
    }
  }

  async integrarComOutraAPI(data) {
    try {
      return await this.pedidoGatewayPort.integrarComOutraAPI(data);
    } catch (err) {
      console.error(`Erro ao comunicar com outra API: ${err}`);
      throw new Error(`Erro ao comunicar com outra API`);
    }
  }
}

module.exports = PedidoService;
