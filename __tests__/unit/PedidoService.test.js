const PedidoService = require('../../src/core/application/services/PedidoService');

describe('Testes de PedidoService', () => {
  let pedidoService, mockPedidoRepository;

  beforeEach(() => {
    mockPedidoRepository = {
      listarPedidos: jest.fn(),
      criarPedido: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      integrarComOutraAPI: jest.fn()
    };

    pedidoService = new PedidoService(mockPedidoRepository);
  });

  it('Deve listar os pedidos', async () => {
    const pedidos = [{ id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' }];

    mockPedidoRepository.listarPedidos.mockResolvedValue(pedidos);

    const result = await pedidoService.listarPedidos();

    expect(result).toEqual(pedidos);
    expect(mockPedidoRepository.listarPedidos).toHaveBeenCalled();
  });

  it('Deve lançar um erro ao listar pedidos com erro', async () => {
    mockPedidoRepository.listarPedidos.mockRejectedValue(new Error('Erro ao listar pedidos'));

    await expect(pedidoService.listarPedidos()).rejects.toThrow('Erro ao listar pedidos');
  });

  it('Deve criar um novo pedido', async () => {
    const novoPedido = { cliente: 'Karen', itens: [{ produto: 'Pizza', quantidade: 1 }] };
    const pedidoCriado = { id: '2', ...novoPedido, status: 'Aguardando Pagamento' };

    mockPedidoRepository.criarPedido.mockResolvedValue(pedidoCriado);

    const result = await pedidoService.criarPedido(novoPedido);

    expect(result).toEqual(pedidoCriado);
    expect(mockPedidoRepository.criarPedido).toHaveBeenCalledWith(novoPedido);
  });

  it('Deve retornar um erro ao criar novo pedido com erro', async () => {
    const novoPedido = { cliente: 'Karen', itens: [{ produto: 'Pizza', quantidade: 1 }] };
    mockPedidoRepository.criarPedido.mockRejectedValue(new Error('Erro ao criar pedido'));

    await expect(pedidoService.criarPedido(novoPedido)).rejects.toThrow('Erro ao criar pedido');
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedido = { id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' };

    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue(pedido);

    const result = await pedidoService.buscarPedidoPorId('1');

    expect(result).toEqual(pedido);
    expect(mockPedidoRepository.buscarPedidoPorId).toHaveBeenCalledWith('1');
  });

  it('Deve retornar um erro se não encontrar o pedido com o ID', async () => {
    const pedido = { id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' };

    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue(pedido);
    await expect(pedidoService.buscarPedidoPorId('3')).rejects.toThrow('Pedido não encontrado');
  });

  it('Deve retornar um erro ao buscar um pedido com erro', async () => {
    mockPedidoRepository.buscarPedidoPorId.mockRejectedValue(new Error('Erro ao buscar pedido'));

    await expect(pedidoService.buscarPedidoPorId('1')).rejects.toThrow('Erro ao buscar pedido');
  });

  it('Deve integrar com uma API baseando em sua URL', async () => {
    const apiResponse = { message: 'Integração realizada com sucesso' };
    const apiURL = 'http://fake-api.com';

    mockPedidoRepository.integrarComOutraAPI.mockResolvedValue(apiResponse);

    const result = await pedidoService.integrarComOutraAPI(apiURL);

    expect(result).toEqual(apiResponse);
    expect(mockPedidoRepository.integrarComOutraAPI).toHaveBeenCalledWith(apiURL);
  });

  it('Deve lançar erro ao integrar com outra API', async () => {
    const apiURL = 'http://fake-api.com';

    mockPedidoRepository.integrarComOutraAPI.mockRejectedValue(new Error('Erro ao integrar com outra API'));

    await expect(pedidoService.integrarComOutraAPI(apiURL)).rejects.toThrow('Erro ao integrar com outra API');
  });
});
