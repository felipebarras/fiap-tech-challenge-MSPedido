class Pedido {
  constructor(cliente, itens, status = 'Aguardando Pagamento', criadoEm = new Date()) {
    this.cliente = cliente;
    this.itens = itens;
    this.status = status;
    this.criadoEm = criadoEm;
  }

  calcularTotal() {
    return this.itens.reduce((total, item) => total + item.quantidade * item.preco, 0);
  }
}

module.exports = Pedido;
