import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const User = {
  async create({ name, email, password, company }) {
    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, company)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, company, created_at`,
      [name, email, hashed, company]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, company, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};
