const PedidoService = require('../src/application/PedidoService');

describe('Testes de PedidoService', () => {
  let pedidoService, mockPedidoGateway;

  beforeAll(() => {
    mockPedidoGateway = {
      listarPedidos: jest.fn().mockResolvedValue([
        { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' },
        { id: '2', cliente: 'João', itens: [{ produto: 'Hamburguer', quantidade: 1 }], status: 'pago' }
      ]),
      buscarPedidoPorId: jest.fn().mockImplementation(async (id) => {
        if (id === 1) return { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' };
        return null;
      }),
      criarPedido: jest.fn().mockResolvedValue({
        id: '3',
        cliente: 'Karen',
        itens: [{ produto: 'Esfiha', quantidade: 5 }],
        status: 'pendente'
      })
    };

    pedidoService = new PedidoService(mockPedidoGateway);
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidos = await pedidoService.listarPedidos();

    expect(pedidos).toEqual([
      { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' },
      { id: '2', cliente: 'João', itens: [{ produto: 'Hamburguer', quantidade: 1 }], status: 'pago' }
    ]);
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedido = await pedidoService.buscarPedidoPorId(1);

    expect(mockPedidoGateway.buscarPedidoPorId).toHaveBeenCalledWith(1);
    expect(pedido).toEqual({ id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' });
  });

  it('Deve retornar null se o pedido não for encontrado', async () => {
    const pedido = await pedidoService.buscarPedidoPorId(999);

    expect(mockPedidoGateway.buscarPedidoPorId).toHaveBeenCalledWith(999);
    expect(pedido).toBeNull();
  });

  it('Deve criar um pedido novo', () => {
    const novoPedido = {
      cliente: 'Karen',
      itens: [{ produto: 'Esfiha', quantidade: 5 }],
      status: 'pendente'
    };

    const pedidoCriado = pedidoService.criarPedido(novoPedido);

    expect(mockPedidoGateway.criarPedido).toHaveBeenCalledWith(novoPedido);
    expect(pedidoCriado).toEqual({ id: '3', ...novoPedido });
  });
});
