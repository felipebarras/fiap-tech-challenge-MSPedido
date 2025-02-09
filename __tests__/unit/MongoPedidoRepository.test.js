const MongoPedidoRepository = require('../../src/adapter/driven/MongoPedidoRepository');

describe('MongoPedidoRepository - Testes', async () => {
  let repository, db, collectionMock;

  beforeEach(() => {
    collectionMock = {
      insertOne: jest.fn(),
      find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
      updateOne: jest.fn()
    };

    db = { collection: jest.fn().mockReturnValue(collectionMock) };
    repository = new MongoPedidoRepository(db);
  });

  test('Deve criar um novo pedido no banco', async () => {
    const pedidoMock = { clienteCPF: '12345678910', itens: [] };
    await repository.criarPedido(pedidoMock);

    expect(collectionMock.insertOne).toHaveBeenCalledWith(pedidoMock);
  });

  test('Deve listar todos os pedidos', async () => {
    await repository.listarPedidos();

    expect(collectionMock.find).toHaveBeenCalled();
  });

  test('Deve buscar um pedido pelo ID', async () => {
    await repository.buscarPedidoPorId('123');

    expect(collectionMock.findOne).toHaveBeenCalledWith({ pedidoId: '123' });
  });

  test('Deve deletar um pedido pelo ID', async () => {
    await repository.deletarPedidoPorId('123');

    expect(collectionMock.deleteOne).toHaveBeenCalledWith({ pedidoId: '123' });
  });

  test('Deve limpar o banco de dados', async () => {
    await repository.limparBancoDeDados();

    expect(collectionMock.deleteMany).toHaveBeenCalled();
  });

  test('Deve atualizar o status de um pedido', async () => {
    await repository.atualizarPedido('123', 'Entregue');

    expect(collectionMock.updateOne).toHaveBeenCalledWith({ pedidoId: '123' }, { $set: { status: 'Entregue' } });
  });
});
