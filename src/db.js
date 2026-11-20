
const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5433,
  user: 'test',
  password: 'test',
  database: 'testdb',
});

async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, nom, email FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

module.exports = { pool, getUserById };
