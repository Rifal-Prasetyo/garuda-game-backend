class AddCommentToThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, content, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentToThread;
