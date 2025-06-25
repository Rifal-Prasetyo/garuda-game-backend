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
    this.comments = comments.map((comment) => {
      const replies = comment.replies.map((reply) => {
        if (reply.is_delete) {
          return {
            ...reply, content: '**balasan telah dihapus**', commentId: undefined, is_delete: undefined,
          };
        }
        return reply;
      });

      if (comment.is_delete) {
        return {
          ...comment, content: '**komentar telah dihapus**', replies, commentId: undefined, is_delete: undefined,
        };
      }
      return {
        ...comment, replies, commentId: undefined, is_delete: undefined,
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
