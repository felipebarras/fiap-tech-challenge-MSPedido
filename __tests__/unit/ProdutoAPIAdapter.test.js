const axios = require('axios');
const ProdutoAPIAdapter = require('../../src/adapter/driven/ProdutoAPIAdapter');
const { productURI } = require('../../src/shared/env');

jest.mock('axios');

describe('ProdutoAPIAdapter - Testes', () => {
  let apiAdapter, pedidoMock;

  beforeEach(() => (apiAdapter = new ProdutoAPIAdapter()));

  pedidoMock = {
    produtoId: 1,
    nome: 'X-Tudo',
    descricao: 'Lanche com hambúrguer, alface, tomate, cebola, bacon e maionese.',
    preco: 15.99,
    categoria: 'LANCHE'
  };

  test('Deve consultar um produto pelo ID', async () => {
    axios.get.mockResolvedValue({ data: pedidoMock });

    const result = await apiAdapter.consultarPorId(1);

    expect(axios.get).toHaveBeenCalledWith(`${productURI}/1`);
    expect(result).toEqual(pedidoMock);
  });

  test('Deve consultar um produto pela categoria', async () => {
    axios.get.mockResolvedValue({ data: pedidoMock });

    const result = await apiAdapter.consultarPorCategoria('LANCHE');

    expect(axios.get).toHaveBeenCalledWith(`${productURI}/categoria/LANCHE`);
    expect(result).toEqual(pedidoMock);
  });
});
