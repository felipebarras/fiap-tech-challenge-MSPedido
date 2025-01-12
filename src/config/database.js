const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'pedidos_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'pedidos_db',
  password: process.env.POSTGRES_PASSWORD || 'pedido_pass',
  port: process.env.POSTGRES_PORT || 5432
});

pool.on('connect', () => {
  console.log('Conexão com banco de dados estabelecida');
});

pool.on('error', (err) => {
  console.error(`Erro inesperado no pool de conexão: ${err}`);
  process.exit(-1);
});

module.exports = pool;
