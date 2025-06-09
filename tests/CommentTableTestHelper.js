/* eslint-disable quotes */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addCommentToThread({
    id = 'comment-jkjfhgcvh', threadId = 'thread-blbalbal', content = 'test reply comment', owner = 'user-123',
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, owner, "threadId") VALUES($1,  $2, $3, $4) `,
      values: [id, content, owner, threadId],
    };
    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
