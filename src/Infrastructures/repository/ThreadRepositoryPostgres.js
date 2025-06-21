const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);
    return new CreatedThread({ ...result.rows[0] });
  }

  async getDetailThread(id) {
    const threadQuery = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
    const threadResult = await this._pool.query(threadQuery);
    if (!threadResult.rowCount) {
      throw new NotFoundError();
    }
    const thread = threadResult.rows[0];

    const commentQuery = {
      text: "SELECT * FROM comments WHERE 'threadId' = $1 ORDER BY date ASC",
      values: [id],
    };
    const commentResult = await this._pool.query(commentQuery);
    return new DetailThread({ ...thread, comments: commentResult.rows });
  }
}

module.exports = ThreadRepositoryPostgres;
