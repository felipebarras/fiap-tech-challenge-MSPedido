const axios = require('axios');
const { customerURI } = require('../../shared/env');

class CustomerAPIAdapter {
  async buscarClientePorCPF(cpf) {
    try {
      const response = await axios.get(`${customerURI}/:cpf`, { urlParams: { cpf } });

      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar cliente por CPF: ${err}`);
      throw new Error(`Erro ao buscar cliente por CPF`);
    }
  }
}

module.exports = CustomerAPIAdapter;
