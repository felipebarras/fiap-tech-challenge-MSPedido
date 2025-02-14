const express = require('express');
const { connectToMongo } = require('../driven/database');
const MongoPedidoRepository = require('../driven/MongoPedidoRepository');
const CustomerAPIAdapter = require('../driven/CustomerAPIAdapter');
const ProdutoAPIAdapter = require('../driven/ProdutoAPIAdapter');
const PedidoService = require('../../core/application/services/PedidoService');
const PedidoController = require('./PedidoController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger/swagger.json');
const { port } = require('../../shared/env');

const app = express();
app.use(express.json());

(async () => {
  try {
    const db = await connectToMongo();
    console.log(`✅ Banco conectado: ${db.databaseName}`);

    // Adapters
    const customerAPIAdapter = new CustomerAPIAdapter();
    const produtoAPIAdapter = new ProdutoAPIAdapter();
    // Repositório
    const pedidoRepository = new MongoPedidoRepository(db);
    const pedidoService = new PedidoService(customerAPIAdapter, produtoAPIAdapter, pedidoRepository);

    // Controller
    const pedidoController = new PedidoController(pedidoService);

    // rota do swagger
    app.use(
      '/api/v1/swagger-ui',
      (req, res, next) => {
        const protocol = req.protocol;
        const host = req.get('Host');

        swaggerDocument.servers = [{ url: `${protocol}://${host}/api/v1`, description: 'Servidor do cliente' }];

        next();
      },
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    // rotas da API
    app.get('/api/v1/health', (req, res, next) => pedidoController.healthCheck(req, res, next));

    app.post('/api/v1/pedidos', (req, res, next) => pedidoController.criarPedido(req, res, next));
    app.get('/api/v1/pedidos', (req, res, next) => pedidoController.listarPedidos(req, res, next));
    app.get('/api/v1/pedidos/:id', (req, res, next) => pedidoController.buscarPedidoPorId(req, res, next));

    app.delete('/api/v1/pedidos', (req, res, next) => pedidoController.limparBancoDeDados(req, res, next));
    app.delete('/api/v1/pedidos/:id', (req, res, next) => pedidoController.deletarPedidoPorId(req, res, next));

    app.patch('/api/v1/pedidos/:id/status', (req, res, next) => pedidoController.atualizarStatusPedido(req, res, next));
  } catch (err) {
    console.error(`❌ Erro ao iniciar o servidor: ${err}`);
    process.exit(1);
  }
})();

// Middleware para lidar com erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));

module.exports = app;
