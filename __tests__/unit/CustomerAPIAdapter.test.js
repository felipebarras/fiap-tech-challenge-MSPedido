const axios = require('axios');
const CustomerAPIAdapter = require('../../src/adapter/driven/CustomerAPIAdapter');
const { customerURI } = require('../../src/shared/env');

jest.mock('axios');

describe('CustomerAPIAdapter - Testes', () => {
  let apiAdapter, clienteMock;

  beforeEach(() => (apiAdapter = new CustomerAPIAdapter()));

  clienteMock = {
    cpf: '12345678910',
    primeiroNome: 'Nome',
    sobrenome: 'Teste',
    email: 'teste@exemplo.com',
    telefones: [
      {
        tipoTelefone: 'CELULAR',
        ddd: '11',
        numero: '912341234'
      }
    ],
    enderecos: [
      {
        cep: '12345-123',
        logradouro: 'Rua exemplo, 123',
        complemento: 'Bloco A, Apto 123',
        bairro: 'Vila Exemplo',
        cidade: 'São Paulo',
        estado: 'SP'
      }
    ]
  };

  test('Deve consultar um cliente por seu CPF', async () => {
    axios.get.mockResolvedValue({ data: clienteMock });

    const result = await apiAdapter.buscarClientePorCPF('12345678910');

    expect(axios.get).toHaveBeenCalledWith(`${customerURI}/12345678910`);
    expect(result).toEqual(clienteMock);
  });
});
