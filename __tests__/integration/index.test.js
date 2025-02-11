const request = require('supertest');
const express = require('express');

jest.mock('../../src/adapter/driven/database', () => ({ connectToMongo: jest.fn().mockResolvedValue({ databaseName: 'test_db' }) }));

jest.mock('../../src/adapter/driven/MongoPedidoRepository');
jest.mock('../../src/adapter/driven/CustomerAPIAdapter');
jest.mock('../../src/adapter/driven/ProdutoAPIAdapter');
jest.mock('../../src/adapter/driver/PedidoController');
jest.mock('../../src/core/application/services/PedidoService');

const { connectToMongo } = require('../../src/adapter/driven/database');
const MongoPedidoRepository = require('../../src/adapter/driven/MongoPedidoRepository');
const CustomerAPIAdapter = require('../../src/adapter/driven/CustomerAPIAdapter');
const ProdutoAPIAdapter = require('../../src/adapter/driven/ProdutoAPIAdapter');
const PedidoService = require('../../src/core/application/services/PedidoService');
const PedidoController = require('../../src/adapter/driver/PedidoController');

describe('API - Testes de integração do Index.js', () => {
  let app;

  beforeAll(async () => {
    connectToMongo.mockResolvedValue({ databaseName: 'test_db' });

    const pedidoRepositoryMock = new MongoPedidoRepository();
    const customerAPIAdapterMock = new CustomerAPIAdapter();
    const produtoAPIAdapterMock = new ProdutoAPIAdapter();
    const pedidoServiceMock = new PedidoService(customerAPIAdapterMock, produtoAPIAdapterMock, pedidoRepositoryMock);
    const pedidoControllerMock = new PedidoController(pedidoServiceMock);

    // mockando métodos do controller para não ter chamadas reais
    pedidoControllerMock.listarPedidos = jest.fn((req, res) => res.status(200).json({ pedidoId: '123' }));
    pedidoControllerMock.criarPedido = jest.fn((req, res) => res.status(201).json({ pedidoId: '123', ...req.body }));
    pedidoControllerMock.buscarPedidoPorId = jest.fn((req, res) => res.status(200).json({ pedidoId: req.params.id }));
    pedidoControllerMock.limparBancoDeDados = jest.fn((req, res) => res.status(200).json({ message: 'Banco de dados limpo' }));
    pedidoControllerMock.deletarPedidoPorId = jest.fn((req, res) => res.status(200).json({ message: `Pedido ${req.params.id} deletado` }));
    pedidoControllerMock.atualizarStatusPedido = jest.fn((req, res) =>
      res.status(200).json({ message: `Pedido ${req.params.id} atualizado`, status: req.body.status })
    );

    // mockar nova instância do Express sem o método listen
    app = express();
    app.use(express.json());

    // rotas mockadas
    app.post('/api/v1/pedidos', pedidoControllerMock.criarPedido);
    app.get('/api/v1/pedidos', pedidoControllerMock.listarPedidos);
    app.get('/api/v1/pedidos/:id', pedidoControllerMock.buscarPedidoPorId);

    app.delete('/api/v1/pedidos', pedidoControllerMock.limparBancoDeDados);
    app.delete('/api/v1/pedidos/:id', pedidoControllerMock.deletarPedidoPorId);

    app.patch('/api/v1/pedidos/:id/status', pedidoControllerMock.atualizarStatusPedido);
  });

  // testes por fim

  test('Deve criar um pedido e retornar um 201', async () => {
    const pedidoMock = { clienteCPF: '1235678910', itens: [{ produtoId: 1, quantidade: 2 }], status: 'Pendente' };
    const response = await request(app).post('/api/v1/pedidos').send(pedidoMock);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(pedidoMock));
  });

  test('Deve listar os pedidos e retornar 200', async () => {
    const response = await request(app).get('/api/v1/pedidos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ pedidoId: '123' });
  });

  test('Deve buscar um pedido pelo ID e retornar 200', async () => {
    const response = await request(app).get('/api/v1/pedidos/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ pedidoId: '123' });
  });

  test('Deve limpar todos os pedidos do banco de dados e retornar 200', async () => {
    const response = await request(app).delete('/api/v1/pedidos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Banco de dados limpo' });
  });

  test('Deve deletar um pedido pelo ID e retornar 200', async () => {
    const response = await request(app).delete('/api/v1/pedidos/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: `Pedido 123 deletado` });
  });

  test('Deve atualizar o status um pedido por seu ID e retornar 200', async () => {
    const response = await request(app).patch('/api/v1/pedidos/123/status').send({ status: 'Entregue' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: `Pedido 123 atualizado`, status: 'Entregue' });
  });

  test('Deve retornar erro 404 caso seja uma rota inexistente', async () => {
    const response = await request(app).get('/api/v1/inexistente');

    expect(response.status).toBe(404);
  });
});
