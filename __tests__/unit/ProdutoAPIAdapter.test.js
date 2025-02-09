const { axios } = require('axios');
const ProdutoAPIAdapter = require('../../src/adapter/driven/ProdutoAPIAdapter');

describe('ProdutoAPIAdapter - Testes', () => {
  let apiAdapter, httpClientMock;

  jest.mock('axios');

  beforeEach(() => {
    httpClientMock = { get: jest.fn() };
    apiAdapter = new ProdutoAPIAdapter(httpClientMock);
  });

  test('Deve consultar um produto pelo ID', async () => {
    axios.get.mockResolvedValue({ data: { id: '1', nome: 'Pizza', preco: 29.9, categoria: 'LANCHE' } });

    const result = await apiAdapter.consultarPorId('1');

    expect(httpClientMock.get).toHaveBeenCalledWith('api/v1/produtos/1');
    expect(result).toEqual({ id: '1', nome: 'Pizza', preco: 29.9 });
  });

  test('Deve consultar um produto pela categoria', async () => {
    axios.get.mockResolvedValue({ data: { id: '1', nome: 'Pizza', preco: 29.9, categoria: 'LANCHE' } });

    const result = await apiAdapter.consultarPorCategoria('LANCHE');

    expect(httpClientMock.get).toHaveBeenCalledWith('api/v1/produtos/categoria/LANCHE');
    expect(result).toEqual({ id: '1', nome: 'Pizza', preco: 29.9, categoria: 'LANCHE' });
  });
});
