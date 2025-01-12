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
    return result.ops[0];
  } catch (err) {
    console.error(`Erro ao executar a query: ${err}`);
    throw err;
  }
}

async function listarPedidos() {
  const db = await connectToMongo();
  const collection = db.collection('pedidos');

  const pedidos = await collection.find().toArray();

  return pedidos;
}

async function buscarPedido(id) {
  const db = await connectToMongo();
  const collection = db.collection('pedidos');

  const pedido = await collection.findOne({ _id: new ObjectId(id) });

  return pedido;
}

module.exports = { criarPedido, listarPedidos, buscarPedido };
