const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
// const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator, commentRepository) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._commentRepository = commentRepository;
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
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
       FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(threadQuery);
    return result.rows[0];
  }

  async verifyThreadAvailibility(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError();
    }
  }
}

module.exports = ThreadRepositoryPostgres;
