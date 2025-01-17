const express = require('express');
const request = require('supertest');
const PedidoController = require('../src/infrastructure/http/PedidoController');
const PedidoService = require('../src/application/PedidoService');
const e = require('express');

describe('Testes de PedidoController', () => {
  let app, mockPedidoService;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    mockPedidoService = {
      listarPedidos: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      criarPedido: jest.fn()
    };

    app.use('/pedidos', PedidoController(mockPedidoService));
  });

  it('Deve listar todos os pedidos', async () => {
    const pedidos = [
      { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' },
      { id: '2', cliente: 'João', itens: [{ produto: 'Hamburguer', quantidade: 1 }], status: 'pago' }
    ];

    mockPedidoService.mockResolvedValue(pedidos);

    const response = await request(app).get('/pedidos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(pedidos);
    expect(mockPedidoService.listarPedidos).toHaveBeenCalled();
  });

  it('Deve retornar um 500 em caso de erro ao listar pedidos', async () => {
    mockPedidoService.listarPedidos.mockRejectedValue(new Error('Erro ao listar pedidos'));

    const response = await request(app).get('/pedidos');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao listar pedidos' });
    expect(mockPedidoService.listarPedidos).toHaveBeenCalled();
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const pedido = {
      id: '1',
      cliente: 'Felipe',
      itens: [{ produto: 'Pizza', quantidade: 2 }],
      status: 'pendente'
    };
    mockPedidoService.buscarPedidoPorId.mockResolvedValue(pedido);

    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(pedido);
    expect(mockPedidoService.buscarPedidoPorId).toHaveBeenCalledWith('1');
  });

  it('Deve retornar um 404 caso o pedido não seja encontrado', async () => {
    mockPedidoService.buscarPedidoPorId.mockResolvedValue(null);

    const response = await request(app).get('/pedidos/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Pedido não encontrado' });
    expect(mockPedidoService.buscarPedidoPorId).toHaveBeenCalledWith('999');
  });

  it('Deve retornar um 500 em caso de erro ao buscar um pedido', async () => {
    mockPedidoService.buscarPedidoPorId.mockRejectedValue(new Error('Erro ao buscar pedido'));

    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao buscar pedido' });
    expect(mockPedidoService.buscarPedidoPorId).toHaveBeenCalledWith('1');
  });

  it('Deve criar um pedido novo e retornar um status 201', () => {
    const novoPedido = {
      cliente: 'Karen',
      itens: [{ produto: 'Esfiha', quantidade: 5 }],
      status: 'pendente'
    };

    mockPedidoService.criarPedido.mockResolvedValue({ id: '3', ...novoPedido });

    return (response = request(app)
      .post('/pedidos')
      .send(novoPedido)
      .expect(201)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: '3', ...novoPedido });
        expect(mockPedidoService.criarPedido).toHaveBeenCalledWith(novoPedido);
      }));
  });

  it('Deve retornar um 500 em caso de erro ao criar o pedido', async () => {
    const novoPedido = {
      cliente: 'Karen',
      itens: [{ produto: 'Esfiha', quantidade: 5 }],
      status: 'pendente'
    };

    mockPedidoService.criarPedido.mockRejectedValue(new Error('Erro ao criar pedido'));

    return (response = request(app)
      .post('/pedidos')
      .send(novoPedido)
      .expect(500)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Erro ao criar pedido' });
        expect(mockPedidoService.criarPedido).toHaveBeenCalledWith(novoPedido);
      }));
  });
});
