class AddCommentToThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, content, owner } = payload;
    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { threadId, content, owner } = payload;
    if (!threadId || !content || !owner) {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentToThread;
