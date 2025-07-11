/* eslint-disable quotes */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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
    /* Soft delete */
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentOwner(owner, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE owner = $1 AND id = $2',
      values: [owner, commentId],
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

  async deleteReplyComment({ id, commentId }) {
    const query = {
      text: `UPDATE comments SET is_delete = TRUE WHERE id = $1 AND "commentId" = $2`,
      values: [id, commentId],
    };
    await this._pool.query(query);
  }

  async getCommentById(id) {
    const query = {
      text: `SELECT comments.*, COUNT(comment_likes."commentId") AS "likeCount"
             FROM comments
             LEFT JOIN comment_likes ON comments.id = comment_likes."commentId"
             WHERE comments.id = $1
             GROUP BY comments.id`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError();
    }
    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
    SELECT
      comments.id,
      users.username,
      comments.date,
      comments.content,
      comments."commentId",
      comments.is_delete,
      COUNT(comment_likes."commentId") AS "likeCount"
    FROM comments
    JOIN users ON comments.owner = users.id
    LEFT JOIN comment_likes ON comments.id = comment_likes."commentId"
    WHERE comments."threadId" = $1
    GROUP BY
      comments.id,
      users.username,
      comments.date,
      comments.content,
      comments."commentId",
      comments.is_delete
    ORDER BY comments.date ASC
  `,
      values: [threadId],
    };
    const comments = await this._pool.query(query);
    return comments.rows;
  }

  async likeComment(commentId, userId) {
    const checkQuery = {
      text: 'SELECT id FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(checkQuery);

    if (result.rowCount > 0) {
      const deleteQuery = {
        text: 'DELETE FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
        values: [commentId, userId],
      };
      await this._pool.query(deleteQuery);
    } else {
      const id = `likes-${this._idGenerator()}`;
      const insertQuery = {
        text: 'INSERT INTO comment_likes (id, "commentId", "userId") VALUES ($1, $2, $3)',
        values: [id, commentId, userId],
      };
      await this._pool.query(insertQuery);
    }
  }
}

module.exports = CommentRepositoryPostgres;
