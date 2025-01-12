const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pedidos_db';

let db;

async function connectToMongo() {
  if (db) return db;

  try {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Conectado no MongoDB com sucesso.');
    db = client.db();

    return db;
  } catch (err) {
    console.log(`Erro ao se conectar no MongoDB: ${err}`);
    throw err;
  }
}

module.exports = connectToMongo;
