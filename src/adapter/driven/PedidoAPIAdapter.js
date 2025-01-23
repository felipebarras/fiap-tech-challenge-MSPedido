const axios = require('axios');

class PedidoAPIAdapter {
  constructor(apiURL) {
    this.apiURL = apiURL;
  }

  async integrarComOutraAPI(data) {
    try {
      const response = await axios.post(`${this.apiURL}/integracao`, data);

      return response.data;
    } catch (err) {
      throw new Error(`Erro ao integrar com outra API: ${err.message}`);
    }
  }
}

module.exports = PedidoAPIAdapter;
