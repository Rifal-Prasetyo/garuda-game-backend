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
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
       FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };
    const threadResult = await this._pool.query(threadQuery);
    if (!threadResult.rowCount) {
      throw new NotFoundError();
    }
    const thread = threadResult.rows[0];
    const commentQuery = {
      text: `
          SELECT comments.id, users.username, comments.date, comments.content, comments."commentId", comments.is_delete
    FROM comments
    JOIN users ON comments.owner = users.id
    WHERE comments."threadId" = $1
    ORDER BY comments.date ASC
      `,
      values: [id],
    };
    const commentResult = await this._pool.query(commentQuery);
    const comments = [];
    const repliesMap = {};
    commentResult.rows.forEach((row) => {
      if (!row.commentId) {
        comments.push({ ...row, replies: [] });
      } else {
        if (!repliesMap[row.commentId]) repliesMap[row.commentId] = [];
        repliesMap[row.commentId].push(row);
      }
    });
    comments.forEach((comment) => {
      // eslint-disable-next-line no-param-reassign
      comment.replies = repliesMap[comment.id] || [];
    });

    return new DetailThread({ ...thread, comments });
  }
}

module.exports = ThreadRepositoryPostgres;
