const { connectToMongo } = require('../../src/adapter/driven/database');
const { MongoClient } = require('mongodb');

jest.mock('mongodb');

describe('Database - Testes', () => {
  test('Deve conectar ao MongoDB com sucesso', async () => {
    const mockClient = { connect: jest.fn(), db: jest.fn().mockReturnValue({}) };
    MongoClient.connect.mockResolvedValue(mockClient);

    const db = await connectToMongo();
    expect(db).toBeDefined();
  });

  test('Deve lançar erro se a conexão falhar', async () => {
    jest.spyOn(MongoClient, 'connect').mockRejectedValue(new Error('Erro ao conectar ao MongoDB'));

    const dbModule = require('../../src/adapter/driven/database');
    dbModule.db = null;

    await expect(connectToMongo()).rejects.toThrow('Erro ao conectar ao MongoDB');
  });
});
