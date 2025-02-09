const MongoPedidoRepository = require('../../src/adapter/driven/MongoPedidoRepository');

describe('MongoPedidoRepository - Testes', () => {
  let repository, db, collectionMock;

  beforeEach(() => {
    collectionMock = {
      insertOne: jest.fn().mockResolvedValue({ insertedId: '123' }),
      find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ pedidoId: '123', clienteCPF: '12345678910', itens: [] }]) }),
      findOne: jest.fn().mockResolvedValue({ pedidoId: '123', clienteCPF: '12345678910', itens: [] }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 10 }),
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 })
    };

    db = { collection: jest.fn().mockReturnValue(collectionMock) };
    repository = new MongoPedidoRepository(db);
  });

  test('Deve criar um novo pedido no banco', async () => {
    const pedidoMock = { clienteCPF: '12345678910', itens: [] };
    const result = await repository.criarPedido(pedidoMock);

    expect(collectionMock.insertOne).toHaveBeenCalledWith(pedidoMock);
    expect(result).toEqual({ pedidoId: '123' });
  });

  test('Deve listar todos os pedidos', async () => {
    const result = await repository.listarPedidos();

    expect(collectionMock.find).toHaveBeenCalled();
    expect(result).toEqual([{ pedidoId: '123', clienteCPF: '12345678910', itens: [] }]);
  });

  test('Deve buscar um pedido pelo ID', async () => {
    const result = await repository.buscarPedidoPorId('123');

    expect(collectionMock.findOne).toHaveBeenCalledWith({ pedidoId: '123' });
    expect(result).toEqual({ pedidoId: '123', clienteCPF: '12345678910', itens: [] });
  });

  test('Deve deletar um pedido pelo ID', async () => {
    const result = await repository.deletarPedidoPorId('123');

    expect(collectionMock.deleteOne).toHaveBeenCalledWith({ pedidoId: '123' });
    expect(result).toEqual({ deletedCount: 1 });
  });

  test('Deve limpar o banco de dados', async () => {
    const result = await repository.limparBancoDeDados();

    expect(collectionMock.deleteMany).toHaveBeenCalled();
    expect(result).toEqual({ acknowledged: true, deletedCount: 10 });
  });

  test('Deve atualizar o status de um pedido', async () => {
    const result = await repository.atualizarPedido('123', 'Entregue');

    expect(collectionMock.updateOne).toHaveBeenCalledWith({ pedidoId: '123' }, { $set: { status: 'Entregue' } });
    expect(result).toEqual({ matchedCount: 1, modifiedCount: 1 });
  });
});
