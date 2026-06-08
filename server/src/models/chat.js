import pool from '../config/db.js';

export const Chat = {
  async create({ userId, title }) {
    const { rows } = await pool.query(
      `INSERT INTO chats (user_id, title)
       VALUES ($1, $2) RETURNING *`,
      [userId, title || 'New Chat']
    );
    return rows[0];
  },

  async findByUser(userId) {
    const { rows } = await pool.query(
      `SELECT c.*, (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
       FROM chats c WHERE c.user_id = $1
       ORDER BY c.updated_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM chats WHERE id = $1', [
      id,
    ]);
    return rows[0] || null;
  },

  async updateTitle(id, title) {
    const { rows } = await pool.query(
      'UPDATE chats SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [title, id]
    );
    return rows[0];
  },

  async remove(id) {
    await pool.query('DELETE FROM chats WHERE id = $1', [id]);
  },

  async countByUser(userId) {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM chats WHERE user_id = $1',
      [userId]
    );
    return parseInt(rows[0].count);
  },
};
