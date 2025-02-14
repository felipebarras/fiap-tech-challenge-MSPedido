const request = require('supertest');
const express = require('express');
const app = require('../../src/adapter/driver/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../src/swagger/swagger.json');

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
const swaggerMiddleware = require('../../src/adapter/driver/swaggerMiddleware');

describe('API - Testes de integração do Index.js', () => {
  let app;
  let originalServers;

  beforeAll(async () => {
    originalServers = swaggerDocument.servers;
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

    app.use(
      '/api/v1/swagger-ui',
      (req, res, next) => {
        const protocol = req.protocol; // "http" or "https"
        const host = req.get('host'); // Current host (e.g., "yourdomain.com")

        swaggerDocument.servers = [
          {
            url: `${protocol}://${host}/api/v1`,
            description: 'Current Server'
          }
        ];

        next();
      },
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    // rotas mockadas
    app.post('/api/v1/pedidos', pedidoControllerMock.criarPedido);
    app.get('/api/v1/pedidos', pedidoControllerMock.listarPedidos);
    app.get('/api/v1/pedidos/:id', pedidoControllerMock.buscarPedidoPorId);

    app.delete('/api/v1/pedidos', pedidoControllerMock.limparBancoDeDados);
    app.delete('/api/v1/pedidos/:id', pedidoControllerMock.deletarPedidoPorId);

    app.patch('/api/v1/pedidos/:id/status', pedidoControllerMock.atualizarStatusPedido);
  });

  afterAll(() => (swaggerDocument.servers = originalServers));

  // testes por fim

  test('Deve atualizar a configuração do Swagger se nao tiver forwarded-proto', async () => {
    const mockHost = 'localhost:3000';

    await request(app).get('/api/v1/swagger-ui').set('host', mockHost);

    expect(swaggerDocument.servers).toEqual([{ url: `http://${mockHost}/api/v1`, description: 'Current Server' }]);
  });

  test('Middleware do Swagger deve chamar o next()', async () => {
    const mockHost = 'testhost.com';
    const nextMock = jest.fn();
    const req = { protocol: 'http', get: jest.fn(() => mockHost) };
    const res = {};

    swaggerMiddleware(req, res, nextMock);

    expect(nextMock).toHaveBeenCalled();
  });

  test('Deve retornar status 200 para a rota do Swagger UI', async () => {
    const response = await request(app).get('/api/v1/swagger-ui/');

    expect(response.status).toBe(200);
  });

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
