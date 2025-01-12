const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pedidos_db';

let db;

async function connectToMongo() {
  if (db) return db;

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Conectado no MongoDB com sucesso.');
    db = client.db();

    return db;
  } catch (err) {
    console.log(`Erro ao se conectar no MongoDB: ${err}`);
    throw err;
  }
}

// if (require.main === module) {
//   (async () => {
//     try {
//       const dbTest = await connectToMongo();
//       console.log('Teste de conexão ao MongoDB concluído');
//       process.exit(0);
//     } catch (err) {
//       console.error(`Erro no teste de conexão: ${err}`);
//       process.exit(1);
//     }
//   })();
// }

module.exports = connectToMongo;
