const { MongoClient } = require('mongodb');
const { mongoURI } = require('../../shared/env');

let db;

async function connectToMongo() {
  if (db) return db;

  try {
    const client = new MongoClient(mongoURI);
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
