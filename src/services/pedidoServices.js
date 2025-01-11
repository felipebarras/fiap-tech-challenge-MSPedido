const pool = require('../config/database');

async function criarPedido(data) {
  const { cliente, itens } = data;
  const query = `
    INSERT INTO pedidos (cliente, itens)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [cliente, JSON.stringify(itens), `Aguardando Pagamento`];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function buscarPedido(id) {
  const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);

  return result.rows[0];
}

module.exports = { criarPedido, buscarPedido };
