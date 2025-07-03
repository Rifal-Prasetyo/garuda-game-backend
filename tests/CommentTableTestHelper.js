/* istanbul ignore file */
/* eslint-disable quotes */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addCommentToThread({
    id = 'comment-123', threadId = 'thread-blbalbal', content = 'test comment', owner = 'user-123', date = new Date(), isDelete = false,
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, owner, "threadId", date, "is_delete") VALUES($1,  $2, $3, $4, $5, $6) `,
      values: [id, content, owner, threadId, date, isDelete],
    };
    await pool.query(query);
  },
  async addReplyToThread({
    id = 'reply-123', threadId = 'thread-blbalbal', content = 'test reply comment', owner = 'user-123', commentId = "comment-123", date = new Date(), isDelete = false,
  }) {
    const query = {
      text: `INSERT INTO comments (id, content, owner, "threadId", "commentId", date, "is_delete") VALUES($1,  $2, $3, $4, $5, $6, $7) `,
      values: [id, content, owner, threadId, commentId, date, isDelete],
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
