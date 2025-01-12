const pool = require('../config/database');

async function criarPedido(data) {
  const { cliente, itens } = data;
  const query = `
    INSERT INTO pedidos (cliente, itens, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [cliente, JSON.stringify(itens), `Aguardando Pagamento`];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function listarPedidos() {
  const { rows } = await pool.query('SELECT * FROM pedidos');

  return rows;
}

async function buscarPedido(id) {
  const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);

  return result.rows[0];
}

async function atualizarStatus(id, status) {
  const query = `
  UPDATE Pedidos
  Set status = $1
  WHERE id = $2
  RETURNING *;
  `;

  const { rows } = await pool.query(query, [status, id]);

  return rows[0];
}

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarStatus };
