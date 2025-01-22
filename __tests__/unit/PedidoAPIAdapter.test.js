const axios = require('axios');
const PedidoAPIAdapter = require('../../src/adapter/driven/PedidoAPIAdapter');

jest.mock('axios');

describe('Testes de PedidoAPIAdapter', () => {
  const mockApiURL = 'http://fake-api.com';
  let pedidoAPIAdapter;

  beforeEach(() => {
    pedidoAPIAdapter = new PedidoAPIAdapter(mockApiURL);
  });

  it('Deve enviar dados para outra API', async () => {
    const apiResponse = { message: 'Integração realizada com sucesso' };

    axios.post.mockResolvedValue({ status: 200, data: apiResponse });

    const result = await pedidoAPIAdapter.enviarDadosParaAPI({});

    expect(axios.post).toHaveBeenCalledWith(mockApiURL, {});
    expect(result).toEqual(apiResponse);
  });

  it('Deve lançar um erro ao falhar o envio de dados a outra API', async () => {
    axios.post.mockRejectedValue(new Error('Erro ao enviar dados para a API externa'));

    await expect(pedidoAPIAdapter.enviarDadosParaAPI({})).rejects.toThrow('Erro ao enviar dados para a API externa');
  });
});
