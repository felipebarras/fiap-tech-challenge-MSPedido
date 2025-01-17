const PedidoService = require('../src/application/PedidoService');
const MongoPedidoRepository = require('../src/infrastructure/database/MongoPedidoRepository');

describe('Testes de PedidoService', () => {
  let pedidoService, mockPedidoGateway;

  beforeEach(() => {
    mockPedidoGateway = {
      criarPedido: jest.fn(),
      salvarPedido: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn()
    };

    pedidoService = new PedidoService(mockPedidoGateway);
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidos = [
      { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' },
      { id: '2', cliente: 'João', itens: [{ produto: 'Hamburguer', quantidade: 1 }], status: 'pago' }
    ];

    mockPedidoGateway.listarPedidos.mockResolvedValue(pedidos);

    const resultado = await pedidoService.listarPedidos();

    expect(mockPedidoGateway.listarPedidos).toHaveBeenCalled();
    expect(resultado).toEqual(pedidos);
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedido = {
      id: '1',
      cliente: 'Felipe',
      itens: [{ produto: 'Pizza', quantidade: 2 }],
      status: 'pendente'
    };

    mockPedidoGateway.buscarPedidoPorId.mockResolvedValue(pedido);

    const resultado = await pedidoService.buscarPedidoPorId('1');

    expect(mockPedidoGateway.buscarPedidoPorId).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(pedido);
  });

  it('Deve lançar um erro se o pedido não for encontrado', async () => {
    mockPedidoGateway.buscarPedidoPorId.mockResolvedValue('999');

    await expect(pedidoService.buscarPedidoPorId('1')).rejects.toThrow('Pedido não encontrado');
    expect(mockPedidoGateway.buscarPedidoPorId).toHaveBeenCalledWith('1');
  });

  it('Deve criar um pedido novo', async () => {
    const novoPedido = {
      cliente: 'Karen',
      itens: [{ produto: 'Esfiha', quantidade: 5 }],
      status: 'pendente'
    };

    mockPedidoGateway.salvarPedido.mockResolvedValue({ id: '3', ...novoPedido });

    const pedidoCriado = await pedidoService.criarPedido(novoPedido);

    expect(mockPedidoGateway.salvarPedido).toHaveBeenCalledWith(expect.any(Object));
    expect(pedidoCriado).toEqual({ id: '3', ...novoPedido });
  });
});
