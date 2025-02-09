const { connectToMongo } = require('../../src/adapter/driven/database');
const { MongoClient } = require('mongodb');

jest.mock('mongodb');

test('Deve conectar ao MongoDB com sucesso', async () => {
  MongoClient.connect.mockResolvedValue({ db: jest.fn().mockResolvedValue('db_mock') });

  const db = await connectToMongo();
  expect(db).toBe('db_mock');
});
