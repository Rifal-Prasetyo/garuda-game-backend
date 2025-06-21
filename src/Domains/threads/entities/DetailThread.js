/* eslint-disable array-callback-return */
class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, date, owner, comments,
    } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.owner = owner;
    this._manipulateComments(comments);
  }

  _manipulateComments(comments) {
    this.comments = comments.map((comment) => {
      const replies = comment.replies.map((reply) => {
        if (reply.is_delete) {
          return { ...reply, content: '**Balasan telah dihapus**' };
        }
        return reply;
      });

      if (comment.is_delete) {
        return { ...comment, content: '**Komentar telah dihapus**', replies };
      }
      return { ...comment, replies };
    });
  }

  _verifyPayload(payload) {
    const {
      id, title, body, date, owner, comments,
    } = payload;
    if (!id || !title || !body || !date || !owner) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
            || typeof title !== 'string'
            || typeof body !== 'string'
            || typeof date !== 'object'
            || typeof owner !== 'string'
            || !Array.isArray(comments)
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
