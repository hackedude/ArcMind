import pool from '../config/db.js';

export const Message = {
  async create({ chatId, role, content }) {
    const { rows } = await pool.query(
      `INSERT INTO messages (chat_id, role, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [chatId, role, content]
    );
    return rows[0];
  },

  async findByChat(chatId) {
    const { rows } = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    return rows;
  },
};
