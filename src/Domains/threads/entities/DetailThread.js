/* eslint-disable array-callback-return */
class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, date, username, comments,
    } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this._manipulateComments(comments);
  }

  _manipulateComments(comments) {
    const commentsData = [];
    const repliesMap = {};

    comments.forEach((row) => {
      if (!row.commentId) {
        commentsData.push({ ...row, replies: [] });
      } else {
        (repliesMap[row.commentId] = repliesMap[row.commentId] || []).push(row);
      }
    });

    this.comments = commentsData.map((comment) => {
      const replies = (repliesMap[comment.id] || []).map((reply) => ({
        ...reply,
        content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
        likeCount: Number(comment.likeCount),
        commentId: undefined,
        is_delete: undefined,
      }));

      return {
        ...comment,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        replies,
        likeCount: Number(comment.likeCount),
        commentId: undefined,
        is_delete: undefined,
      };
    });
  }

  _verifyPayload(payload) {
    const {
      id, title, body, date, username, comments,
    } = payload;
    if (!id || !title || !body || !date || !username) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
            || typeof title !== 'string'
            || typeof body !== 'string'
            || typeof date !== 'object'
            || typeof username !== 'string'
            || !Array.isArray(comments)
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
