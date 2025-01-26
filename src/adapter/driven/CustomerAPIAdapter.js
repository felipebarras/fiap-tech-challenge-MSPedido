const axios = require('axios');
const { customerURI } = require('../../shared/env');

class CustomerAPIAdapter {
  async buscarClientePorCPF(cpf) {
    try {
      console.log(`URL gerada: ${customerURI}/`);
      console.log(`Iniciando busca por CPF: ${cpf}`);
      const response = await axios.get(`${customerURI}/${cpf}`);

      console.log(`Cliente encontrado: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar cliente por CPF: ${err.message}`);
      console.error(`Stack: ${err.stack}`);
      throw new Error(`Erro ao buscar cliente por CPF`);
    }
  }
}

module.exports = CustomerAPIAdapter;
