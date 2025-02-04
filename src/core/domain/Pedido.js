class Pedido {
  constructor(cliente, itens, status = 'Aguardando Pagamento', criadoEm) {
    this.cliente = cliente;
    this.itens = itens;
    this.status = status;
    this.criadoEm = criadoEm;
  }
}

module.exports = Pedido;
