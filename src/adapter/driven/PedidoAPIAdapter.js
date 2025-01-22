const axios = require('axios');
const PedidoGatewayPort = require('../../core/application/ports/PedidoGatewayPort');

class PedidoAPIAdapter extends PedidoGatewayPort {
  constructor(apiURL) {
    super();
    this.apiURL = apiURL;
  }

  async enviarDados(data) {
    try {
      const response = await axios.post(`${this.apiURL}/endpoint`, data);
      if (response.status !== 200) throw new Error('Falha ao enviar dados para a API');
      console.log('Dados enviados com sucesso para a API');

      return response.data;
    } catch (err) {
      console.error(`Erro ao enviar dados para a API: ${err}`);
      throw new Error('Erro ao enviar dados para a API');
    }
  }
}

module.exports = PedidoAPIAdapter;
