const PedidoController = require('../../src/adapter/driver/PedidoController');

describe('PedidoController - Testes', () => {
  let pedidoServiceMock, pedidoController, req, res, next;

  beforeEach(() => {
    pedidoServiceMock = {
      criarPedido: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      deletarPedidoPorId: jest.fn(),
      limparBancoDeDados: jest.fn(),
      atualizarStatusPedido: jest.fn()
    };

    pedidoController = new PedidoController(pedidoServiceMock);
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('Deve criar um novo pedido', async () => {
    const pedidoMock = { clienteCPF: '12345678910', pedidoId: '123', itens: [{ produtoId: '1', quantidade: 1 }] };
    pedidoServiceMock.criarPedido.mockResolvedValue(pedidoMock);

    req.body = pedidoMock;
    await pedidoController.criarPedido(req, res, next);

    expect(pedidoServiceMock.criarPedido).toHaveBeenCalledWith(pedidoMock);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(pedidoMock);
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidosMock = [{ pedidoId: '123', clienteCPF: '12345678910', itens: [{ produtoId: '1', quantidade: 1 }], status: 'Pendente' }];
    pedidoServiceMock.listarPedidos.mockResolvedValue(pedidosMock);

    await pedidoController.listarPedidos(req, res, next);

    expect(pedidoServiceMock.listarPedidos).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(pedidosMock);
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedidoMock = { pedidoId: '123', clienteCPF: '12345678910', status: 'Pendente' };
    pedidoServiceMock.buscarPedidoPorId.mockResolvedValue(pedidoMock);

    req.params.id = pedidoMock.pedidoId;
    await pedidoController.buscarPedidoPorId(req, res, next);

    expect(pedidoServiceMock.buscarPedidoPorId).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(pedidoMock);
  });

  it('Deve deletar um pedido por seu ID', async () => {
    pedidoServiceMock.deletarPedidoPorId.mockResolvedValue({ deletedCount: 1 });

    req.params.id = '123';
    await pedidoController.deletarPedidoPorId(req, res, next);

    expect(pedidoServiceMock.deletarPedidoPorId).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: `Pedido com ID 123 foi removido com sucesso`, deletedCount: 1 });
  });

  it('Deve deletar todos os pedidos do banco de dados', async () => {
    pedidoServiceMock.limparBancoDeDados.mockResolvedValue({ deletedCount: 5 });

    await pedidoController.limparBancoDeDados(req, res, next);

    expect(pedidoServiceMock.limparBancoDeDados).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todos os pedidos foram removidos com sucesso', deletedCount: 5 });
  });

  it('Deve atualizar o status de um pedido', async () => {
    pedidoServiceMock.atualizarStatusPedido.mockResolvedValue({ modifiedCount: 1 });

    req.params.id = '123';
    req.body.status = 'Pronto';

    await pedidoController.atualizarStatusPedido(req, res, next);

    expect(pedidoServiceMock.atualizarStatusPedido).toHaveBeenCalledWith('123', 'Pronto');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: `Status do pedido com ID 123 foi atualizado para Pronto` });
  });
});

describe('PedidoController - Testes de Erro', () => {
  let pedidoServiceMock, pedidoController, req, res, next;

  beforeEach(() => {
    pedidoServiceMock = {
      criarPedido: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      deletarPedidoPorId: jest.fn(),
      limparBancoDeDados: jest.fn(),
      atualizarStatusPedido: jest.fn()
    };

    pedidoController = new PedidoController(pedidoServiceMock);
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('Deve retornar 500 se houver erro ao criar pedido', async () => {
    pedidoServiceMock.criarPedido.mockRejectedValue(new Error('Erro ao criar pedido'));

    await pedidoController.criarPedido(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar pedido' });
  });

  test('Deve retornar 500 se houver erro ao listar pedidos', async () => {
    pedidoServiceMock.listarPedidos.mockRejectedValue(new Error('Erro ao listar pedidos'));

    await pedidoController.listarPedidos(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar pedidos' });
  });

  test('Deve retornar 404 se o pedido não for encontrado', async () => {
    pedidoServiceMock.buscarPedidoPorId.mockResolvedValue(null);

    req.params.id = '456';
    await pedidoController.buscarPedidoPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado' });
  });

  test('Deve retornar 500 se houver erro ao buscar pedido por ID', async () => {
    pedidoServiceMock.buscarPedidoPorId.mockRejectedValue(new Error('Erro ao buscar pedido'));

    await pedidoController.buscarPedidoPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar pedido' });
  });

  test('Deve retornar 404 se tentar deletar um pedido que não existe', async () => {
    pedidoServiceMock.deletarPedidoPorId.mockResolvedValue({ deletedCount: 0 });

    req.params.id = '456';
    await pedidoController.deletarPedidoPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado' });
  });

  test('Deve retornar 500 se houver erro ao deletar um pedido', async () => {
    pedidoServiceMock.deletarPedidoPorId.mockRejectedValue(new Error('Erro ao deletar pedido'));

    await pedidoController.deletarPedidoPorId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar pedido' });
  });

  test('Deve retornar 400 se o status informado for inválido', async () => {
    req.params.id = '123';
    req.body.status = 'invalido';

    await pedidoController.atualizarStatusPedido(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Status Inválido' });
  });

  test('Deve retornar 404 se o pedido não for encontrado ao atualizar o status', async () => {
    pedidoServiceMock.atualizarStatusPedido.mockResolvedValue({ modifiedCount: 0 });

    req.params.id = '123';
    req.body.status = 'Pronto';

    await pedidoController.atualizarStatusPedido(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pedido não encontrado' });
  });

  test('Deve retornar 500 se houver erro ao atualizar status do pedido', async () => {
    pedidoServiceMock.atualizarStatusPedido.mockRejectedValue(new Error('Erro no banco'));

    req.params.id = '123';
    req.body.status = 'Pronto';

    await pedidoController.atualizarStatusPedido(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro no banco' });
  });
});
