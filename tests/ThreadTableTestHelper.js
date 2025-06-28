/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async createThread({
    id = 'thread-blbalbal', title = 'testing thread test', body = 'test thread', owner = 'user-123', date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };
    await pool.query(query);
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = ThreadTableTestHelper;
