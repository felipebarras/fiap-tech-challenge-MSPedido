const { MongoClient } = require('mongodb');
const { mongoURI } = require('../../shared/env');

let db;

async function connectToMongo() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Conectado ao MongoDB estabelecida com sucesso!');

    db = client.db();

    return db;
  } catch (err) {
    console.error(`Erro ao conectar ao MongoDB: ${err}`);
    process.exit(1);
  }
}

async function closeConnection() {
  if (client) {
    await client.close();
    console.log('Conexão com o MongoDB fechada com sucesso!');
  }
}

module.exports = { connectToMongo, closeConnection, getDb: () => db };
