const axios = require('axios');
const PedidoAPIAdapter = require('../src/adapter/driven/PedidoAPIAdapter');

jest.mock('axios');

describe('Testes de PedidoAPIAdapter', () => {
  const mockApiURL = 'http://api-sample.com';
  let pedidoAPIAdapter;

  beforeEach(() => {
    pedidoAPIAdapter = new PedidoAPIAdapter(mockApiURL);
  });

  it('Deve criar um pedido via API externa', async () => {
    const mockData = { id: '1', cliente: ' João', itens: [{ produto: 'Kibe', quantidade: 5 }], status: 'Confirmado' };
    const mockResponse = { status: 200, data: { success: true } };

    axios.post.mockResolvedValue(mockResponse);

    const result = await pedidoAPIAdapter.enviarDados(mockData);

    expect(result).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(`${mockApiURL}/endpoint`, mockData);
  });

  it('Deve lançar um erro ao enviar dados para a API e retornar status diferente de 200', async () => {
    const mockData = { id: '1', cliente: ' João', itens: [{ produto: 'Kibe', quantidade: 5 }], status: 'Confirmado' };
    const mockResponse = { response: { status: 200 } };

    axios.post.mockRejectedValue(mockResponse);

    await expect(pedidoAPIAdapter.enviarDados(mockData)).rejects.toThrowError('Erro ao enviar dados para a API externa');
    expect(axios.post).toHaveBeenCalledWith(`${mockApiURL}/endpoint`, mockData);
  });
});
