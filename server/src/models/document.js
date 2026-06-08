import pool from '../config/db.js';

export const Document = {
  async create({ userId, filename, originalName, fileSize, mimeType }) {
    const { rows } = await pool.query(
      `INSERT INTO documents (user_id, filename, original_name, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, filename, originalName, fileSize, mimeType]
    );
    return rows[0];
  },

  async findByUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM documents WHERE id = $1', [
      id,
    ]);
    return rows[0] || null;
  },

  async updateText(id, textContent, pageCount) {
    const { rows } = await pool.query(
      `UPDATE documents SET text_content = $1, page_count = $2, status = 'ready'
       WHERE id = $3 RETURNING *`,
      [textContent, pageCount, id]
    );
    return rows[0];
  },

  async updateSummary(id, summary, keyInsights) {
    const { rows } = await pool.query(
      `UPDATE documents SET summary = $1, key_insights = $2
       WHERE id = $3 RETURNING *`,
      [summary, JSON.stringify(keyInsights), id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      'UPDATE documents SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  },

  async remove(id) {
    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
  },

  async countByUser(userId) {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM documents WHERE user_id = $1',
      [userId]
    );
    return parseInt(rows[0].count);
  },

  async recentByUser(userId, limit = 5) {
    const { rows } = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return rows;
  },
};
