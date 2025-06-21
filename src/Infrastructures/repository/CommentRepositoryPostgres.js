const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedCommentToThread = require('../../Domains/comments/entities/AddedCommentToThread');
const AddedReplyComment = require('../../Domains/comments/entities/AddedReplyComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentToThread(addComment) {
    const { threadId, content, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      // eslint-disable-next-line quotes
      text: `INSERT INTO comments (id, content, owner, "threadId" ) VALUES($1, $2, $3, $4) RETURNING id, content, owner`,
      values: [id, content, owner, threadId],
    };
    const result = await this._pool.query(query);
    return new AddedCommentToThread({ ...result.rows[0] });
  }

  async deleteCommentToThread(commentId) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE owner = $1 AND id = $2',
      values: [userId, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError();
    }
  }

  async addReplyComment(replyComment) {
    const {
      threadId, commentId, content, owner,
    } = replyComment;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      // eslint-disable-next-line quotes
      text: `INSERT INTO comments (id, content, owner, "threadId", "commentId" ) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, content, owner, threadId, commentId],
    };
    const result = await this._pool.query(query);
    return new AddedReplyComment({ ...result.rows[0] });
  }

  async deleteReplyComment(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
