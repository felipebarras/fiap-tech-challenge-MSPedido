const { MongoClient } = require('mongodb');
const { mongoURI } = require('../../shared/env');

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoURI);

    return client.db();
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB');
    throw err;
  }
}

module.exports = { connectToMongo };
