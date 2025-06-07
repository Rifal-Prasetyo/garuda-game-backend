class AddReplyCommentUseCase {
  constructor({ commentRepository }) {
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const addReplyComment = await this.commentRepository.addReplyComment(payload);
    return addReplyComment;
  }

  _verifyPayload(payload) {
    const {
      threadId, commentId, content, owner,
    } = payload;
    if (!threadId || !commentId || !content || !owner) {
      throw new Error('ADD_REPLY_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_REPLY_COMMENT_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = AddReplyCommentUseCase;
