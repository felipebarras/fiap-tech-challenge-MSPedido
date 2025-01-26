const { MongoClient } = require('mongodb');
const { mongoURI } = require('../../shared/env');

let db;

async function connectToMongo() {
  if (db) return db;

  try {
    const client = await MongoClient.connect(mongoURI);
    db = client.db();
    console.log(`Conexão com o MongoDB estabelecida! Banco: ${db.databaseName}`);

    return db;
  } catch (err) {
    console.error(`Erro ao conectar ao MongoDB: ${err}`);
    // process.exit(1);
    throw err;
  }
}

module.exports = { connectToMongo };
