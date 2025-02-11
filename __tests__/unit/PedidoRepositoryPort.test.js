const PedidoRepositoryPort = require('../../src/core/application/ports/PedidoRepositoryPort');

describe('PedidoRepositoryPort - Interface', () => {
  let repositoryPort;

  beforeEach(() => (repositoryPort = new PedidoRepositoryPort()));

  test('Deve lançar um erro ao chamar criarPedido sem implementação', async () =>
    await expect(repositoryPort.criarPedido({})).rejects.toThrow('Método não implementado'));

  test('Deve lançar um erro ao chamar listarPedidos sem implementação', async () =>
    await expect(repositoryPort.listarPedidos()).rejects.toThrow('Método não implementado'));

  test('Deve lançar um erro ao chamar buscarPedidoPorId sem implementação', async () =>
    await expect(repositoryPort.buscarPedidoPorId(1)).rejects.toThrow('Método não implementado'));

  test('Deve lançar um erro ao chamar deletarPedidoPorId sem implementação', async () =>
    await expect(repositoryPort.deletarPedidoPorId(1)).rejects.toThrow('Método não implementado'));

  test('Deve lançar um erro ao chamar limparBancoDeDados sem implementação', async () =>
    await expect(repositoryPort.limparBancoDeDados()).rejects.toThrow('Método não implementado'));

  test('Deve lançar um erro ao chamar atualizarStatusPedido sem implementação', async () =>
    await expect(repositoryPort.atualizarStatusPedido(1, 'Entregue')).rejects.toThrow('Método não implementado'));
});
