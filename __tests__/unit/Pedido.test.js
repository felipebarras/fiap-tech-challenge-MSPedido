const Pedido = require('../../src/core/domain/Pedido');

describe('Pedido - Modelo de Domínio', () => {
  test('Deve instanciar um Pedido corretamente com os valores fornecidos', async () => {
    const clienteMock = { nome: 'Cliente Teste', clienteCPF: '12345678900' };
    const itensMock = [{ produtoId: 1, quantidade: 1 }];
    const statusMock = 'Entregue';
    const criadoEmMock = new Date();

    const pedido = new Pedido(clienteMock, itensMock, statusMock, criadoEmMock);

    expect(pedido.cliente).toEqual(clienteMock);
    expect(pedido.itens).toEqual(itensMock);
    expect(pedido.status).toEqual(statusMock);
    expect(pedido.criadoEm).toEqual(criadoEmMock);
  });

  test('Deve definir status padrão como "Aguardando Pagamento" caso não seja informado', async () => {
    const clienteMock = { nome: 'Cliente Teste', clienteCPF: '12345678900' };
    const itensMock = [{ produtoId: 1, quantidade: 1 }];
    const criadoEmMock = new Date();

    const pedido = new Pedido(clienteMock, itensMock, undefined, criadoEmMock);

    expect(pedido.status).toEqual('Aguardando Pagamento');
  });
});
