const connectToMongo = require('../config/database');

async function criarPedido(data) {
  const db = await connectToMongo();
  const collection = db.collection('pedidos');

  const novoPedido = {
    cliente: data.cliente,
    itens: data.itens,
    status: 'Aguardando Pagamento',
    data: new Date()
  };

  try {
    const result = await collection.insertOne(novoPedido);
    console.log(`Pedido inserido com sucesso: ${result.insertedId}`);

    return { ...novoPedido, _id: result.insertedId };
  } catch (err) {
    console.error(`Erro ao executar a query: ${err}`);
    throw err;
  }
}

async function listarPedidos() {
  const db = await connectToMongo();
  const collection = db.collection('pedidos');

  try {
    const pedidos = await collection.find().toArray();
    console.log(`Pedidos listados: ${pedidos}`);

    return pedidos;
  } catch (err) {
    console.error(`Erro ao listar pedidos: ${err}`);
    throw err;
  }
}

async function buscarPedido(id) {
  const db = await connectToMongo();
  const collection = db.collection('pedidos');

  const pedido = await collection.findOne({ _id: new ObjectId(id) });

  return pedido;
}

module.exports = { criarPedido, listarPedidos, buscarPedido };
