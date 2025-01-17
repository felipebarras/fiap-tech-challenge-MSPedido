const express = require('express');
const request = require('supertest');
const PedidoController = require('../src/infrastructure/http/PedidoController');
const PedidoService = require('../src/application/PedidoService');

describe('Testes de PedidoController', () => {
  let app, mockPedidoService;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    mockPedidoService = {
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

    app.use('/pedidos', PedidoController(mockPedidoService));
  });

  it('Deve listar todos os pedidos', async () => {
    const response = await request(app).get('/pedidos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: '1', cliente: 'Felipe', itens: [{ produto: 'Pizza', quantidade: 2 }], status: 'pendente' },
      { id: '2', cliente: 'João', itens: [{ produto: 'Hamburguer', quantidade: 1 }], status: 'pronto' }
    ]);
  });

  it('Deve retornar um 500 em caso de erro ao listar pedidos', async () => {
    jest.spyOn(mockPedidoService, 'listarPedidos').mockImplementationOnce(async () => {
      throw new Error('Erro ao listar pedidos');
    });

    const response = await request(app).get('/pedidos');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao listar pedidos' });
  });

  it('Deve buscar um pedido por seu ID', async () => {
    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: '1',
      cliente: 'Felipe',
      itens: [{ produto: 'Pizza', quantidade: 2 }],
      status: 'pendente'
    });
  });

  it('Deve retornar um 404 caso o pedido não seja encontrado', async () => {
    const response = await request(app).get('/pedidos/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Pedido não encontrado' });
  });

  it('Deve retornar um 500 em caso de erro ao buscar um pedido', async () => {
    jest.spyOn(mockPedidoService, 'buscarPedidoPorId').mockImplementationOnce(async () => {
      throw new Error('Erro ao buscar pedido');
    });

    const response = await request(app).get('/pedidos/1');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro ao buscar pedido' });
  });

  it('Deve criar um pedido novo e retornar um status 201', () => {
    const novoPedido = {
      cliente: 'Karen',
      itens: [{ produto: 'Esfiha', quantidade: 5 }],
      status: 'pendente'
    };

    return (response = request(app)
      .post('/pedidos')
      .send(novoPedido)
      .expect(201)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: '3', ...novoPedido });
      }));
  });
});
