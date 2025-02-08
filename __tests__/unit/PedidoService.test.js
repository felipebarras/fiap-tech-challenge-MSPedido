const PedidoService = require('../../src/core/application/services/PedidoService');

describe('PedidoService - Testes', () => {
  let customerAPIMock, produtoAPIMock, mongoDbRepositoryMock, pedidoService;

  beforeEach(() => {
    customerAPIMock = { buscarClientePorCPF: jest.fn() };
    produtoAPIMock = { consultarPorId: jest.fn() };
    mongoDbRepositoryMock = {
      criarPedido: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      deletarPedidoPorId: jest.fn(),
      limparBancoDeDados: jest.fn(),
      atualizarPedido: jest.fn()
    };

    pedidoService = new PedidoService(customerAPIMock, produtoAPIMock, mongoDbRepositoryMock);
  });

  it('Deve criar um novo pedido com sucesso', async () => {
    const pedidoMock = {
      clienteCPF: '12345678910',
      itens: [{ produtoId: '1', quantidade: 2 }],
      status: 'Pendente'
    };

    const clienteMock = { nome: 'João Silva', cpf: '12345678910' };
    const produtoMock = { nome: 'Pizza', preco: 25.5 };

    customerAPIMock.buscarClientePorCPF.mockResolvedValue(clienteMock);
    produtoAPIMock.consultarPorId.mockResolvedValue(produtoMock);
    mongoDbRepositoryMock.criarPedido.mockResolvedValue({ pedidoId: 'abc123', ...pedidoMock });

    const pedidoCriado = await pedidoService.criarPedido(pedidoMock);

    expect(customerAPIMock.buscarClientePorCPF).toHaveBeenCalledWith('12345678910');
    expect(produtoAPIMock.consultarPorId).toHaveBeenCalledWith('1');
    expect(mongoDbRepositoryMock.criarPedido).toHaveBeenCalled();
    expect(pedidoCriado).toHaveProperty('pedidoId', 'abc123');
  });

  it('Deve retornar erro ao tentar criar um pedido com cliente inexistente', async () => {
    const pedidoMock = {
      clienteCPF: '00000000000',
      itens: [{ produtoId: '1', quantidade: 2 }],
      status: 'Pendente'
    };

    customerAPIMock.buscarClientePorCPF.mockResolvedValue(null);

    await expect(pedidoService.criarPedido(pedidoMock)).rejects.toThrow('Cliente não encontrado');
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidosMock = [{ pedidoId: '123', clienteCPF: '12345678910', itens: [{ produtoId: '1', quantidade: 1 }], status: 'Pendente' }];
    mongoDbRepositoryMock.listarPedidos.mockResolvedValue(pedidosMock);

    const pedidos = await pedidoService.listarPedidos();

    expect(mongoDbRepositoryMock.listarPedidos).toHaveBeenCalled();
    expect(pedidos).toEqual(pedidosMock);
  });

  it('Deve retornar erro ao listar pedidos se o repositório falhar', async () => {
    mongoDbRepositoryMock.listarPedidos.mockRejectedValue(new Error('Erro ao listar pedidos'));

    await expect(pedidoService.listarPedidos()).rejects.toThrow('Erro ao listar pedidos');
  });

  it('Deve buscar um pedido por ID', async () => {
    const pedidoMock = { pedidoId: '123', clienteCPF: '12345678910', status: 'Pendente' };
    mongoDbRepositoryMock.buscarPedidoPorId.mockResolvedValue(pedidoMock);

    const pedido = await pedidoService.buscarPedidoPorId('123');

    expect(mongoDbRepositoryMock.buscarPedidoPorId).toHaveBeenCalledWith('123');
    expect(pedido).toEqual(pedidoMock);
  });

  it('Deve retornar erro ao buscar um pedido inexistente', async () => {
    mongoDbRepositoryMock.buscarPedidoPorId.mockResolvedValue(null);

    await expect(pedidoService.buscarPedidoPorId('456')).rejects.toThrow('Pedido não encontrado');
  });

  it('Deve deletar um pedido por ID', async () => {
    mongoDbRepositoryMock.deletarPedidoPorId.mockResolvedValue({ deletedCount: 1 });

    const result = await pedidoService.deletarPedidoPorId('123');

    expect(mongoDbRepositoryMock.deletarPedidoPorId).toHaveBeenCalledWith('123');
    expect(result).toEqual({ deletedCount: 1 });
  });

  it('Deve retornar erro ao deletar um pedido inexistente', async () => {
    mongoDbRepositoryMock.deletarPedidoPorId.mockResolvedValue({ deletedCount: 0 });

    await expect(pedidoService.deletarPedidoPorId('456')).rejects.toThrow('Pedido não encontrado');
  });

  it('Deve limpar o banco de dados', async () => {
    mongoDbRepositoryMock.limparBancoDeDados.mockResolvedValue({ deletedCount: 10 });

    const result = await pedidoService.limparBancoDeDados();

    expect(mongoDbRepositoryMock.limparBancoDeDados).toHaveBeenCalled();
    expect(result).toEqual({ deletedCount: 10 });
  });

  it('Deve retornar erro ao tentar limpar o banco de dados com falha', async () => {
    mongoDbRepositoryMock.limparBancoDeDados.mockRejectedValue(new Error('Erro ao limpar pedidos'));

    await expect(pedidoService.limparBancoDeDados()).rejects.toThrow('Erro ao limpar pedidos');
  });

  it('Deve atualizar o status de um pedido', async () => {
    const pedidoMock = { pedidoId: '123', status: 'Pendente' };
    mongoDbRepositoryMock.buscarPedidoPorId.mockResolvedValue(pedidoMock);
    mongoDbRepositoryMock.atualizarPedido.mockResolvedValue({ modifiedCount: 1 });

    const result = await pedidoService.atualizarStatusPedido('123', 'Pronto');

    expect(mongoDbRepositoryMock.buscarPedidoPorId).toHaveBeenCalledWith('123');
    expect(mongoDbRepositoryMock.atualizarPedido).toHaveBeenCalledWith('123', 'Pronto');
    expect(result).toEqual({ modifiedCount: 1 });
  });

  it('Deve retornar erro ao atualizar status de um pedido inexistente', async () => {
    mongoDbRepositoryMock.buscarPedidoPorId.mockResolvedValue(null);

    await expect(pedidoService.atualizarStatusPedido('456', 'Pronto')).rejects.toThrow('Pedido não encontrado');
  });

  it('Deve retornar erro ao atualizar status com falha no repositório', async () => {
    const pedidoMock = { pedidoId: '123', status: 'Pendente' };
    mongoDbRepositoryMock.buscarPedidoPorId.mockResolvedValue(pedidoMock);
    mongoDbRepositoryMock.atualizarPedido.mockRejectedValue(new Error('Erro ao atualizar pedido'));

    await expect(pedidoService.atualizarStatusPedido('123', 'Pronto')).rejects.toThrow('Erro ao atualizar pedido');
  });
});
