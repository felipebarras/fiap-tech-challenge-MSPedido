const express = require('express');
const request = require('supertest');
const PedidoController = require('../../src/adapter/driver/PedidoController');

describe('Testes de PedidoController', () => {
  let app, mockPedidoService;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    mockPedidoService = {
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      criarPedido: jest.fn(),
      deletarPedidoPorId: jest.fn(),
      limparBancoDeDados: jest.fn()
    };

    app.use('/pedidos', PedidoController(mockPedidoService));
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidos = [{ id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' }];

    mockPedidoService.listarPedidos.mockResolvedValue(pedidos);

    const response = await request(app).get('/pedidos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(pedidos);
    expect(mockPedidoService.listarPedidos).toHaveBeenCalled();
  });

  it('Deve retornar 500 ao listar pedidos com erro', async () => {
    mockPedidoService.listarPedidos.mockRejectedValue(new Error('Erro ao listar pedidos'));

    const response = await request(app).get('/pedidos');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao listar pedidos' });
  });

  it('Deve criar um novo pedido', async () => {
    const novoPedido = { cliente: 'Karen', itens: [{ produto: 'Pizza', quantidade: 1 }] };
    const pedidoCriado = { id: '2', ...novoPedido, status: 'Aguardando Pagamento' };

    mockPedidoService.criarPedido.mockResolvedValue(pedidoCriado);

    const response = await request(app).post('/pedidos').send(novoPedido);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(pedidoCriado);
    expect(mockPedidoService.criarPedido).toHaveBeenCalledWith(novoPedido);
  });

  it('Deve retornar 500 ao criar um novo pedido com erro', async () => {
    const novoPedido = { cliente: 'Karen', itens: [{ produto: 'Pizza', quantidade: 1 }] };
    mockPedidoService.criarPedido.mockRejectedValue(new Error('Erro ao criar pedido'));

    const response = await request(app).post('/pedidos').send(novoPedido);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Erro ao criar pedido' });
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedido = { id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' };

    mockPedidoService.buscarPedidoPorId.mockResolvedValue(pedido);

    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(pedido);
    expect(mockPedidoService.buscarPedidoPorId).toHaveBeenCalledWith('1');
  });

  it('Deve retornar 500 ao buscar pedidos com erro', async () => {
    mockPedidoService.buscarPedidoPorId.mockRejectedValue(new Error('Erro ao buscar pedido'));

    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Erro ao buscar pedido' });
  });

  it('Deve deletar um pedido por seu ID', async () => {
    const pedido = { id: '1', cliente: 'Felipe', itens: [{ produto: 'Hamburguer', quantidade: 2 }], status: 'Aguardando Pagamento' };

    mockPedidoService.deletarPedidoPorId.mockResolvedValue(pedido);

    const response = await request(app).delete('/pedidos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(pedido);
    expect(mockPedidoService.deletarPedido).toHaveBeenCalledWith('1');
  });

  it('Deve retornar 500 ao deletar pedido com erro', async () => {
    mockPedidoService.deletarPedidoPorId.mockRejectedValue(new Error('Erro ao deletar pedido'));

    const response = await request(app).delete('/pedidos/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Erro ao deletar pedido' });
  });

  it('Deve deletar todos os pedidos do banco de dados', async () => {
    mockPedidoService.limparBancoDeDados.mockResolvedValue();

    const response = await request(app).delete('/pedidos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Todos os pedidos foram removidos com sucesso' });
    expect(mockPedidoService.limparBancoDeDados).toHaveBeenCalled();
  });

  it('Deve retornar 500 ao deletar todos os pedidos com erro', async () => {
    mockPedidoService.limparBancoDeDados.mockRejectedValue(new Error('Erro ao deletar todos os pedidos'));

    const response = await request(app).delete('/pedidos');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Erro ao deletar todos os pedidos' });
  });
});
