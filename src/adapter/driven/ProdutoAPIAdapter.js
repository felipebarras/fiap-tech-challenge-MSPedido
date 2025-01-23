const axios = require('axios');
const { productURI } = require('../../shared/env');

class ProdutoAPIAdapter {
  async consultarPorId(id) {
    try {
      const response = await axios.get(`${productURI}/:id`, { urlParams: { id } });

      return response.data;
    } catch (err) {
      console.error(`Erro ao consultar produto por ID: ${err}`);
      throw new Error(`Erro ao consultar produto por ID`);
    }
  }

  async consultarPorCategoria(categoria) {
    try {
      const response = await axios.get(`${productURI}/categoria/:categoria`, { urlParams: { categoria } });

      return response.data;
    } catch (err) {
      console.error(`Erro ao consultar produtos por categoria: ${err}`);
      throw new Error(`Erro ao consultar produtos por categoria`);
    }
  }
}

module.exports = ProdutoAPIAdapter;
