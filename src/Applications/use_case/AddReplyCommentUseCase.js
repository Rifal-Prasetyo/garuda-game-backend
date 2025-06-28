class AddReplyCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId } = payload;
    await this._threadRepository.verifyThreadAvailibility(threadId);
    await this._commentRepository.getCommentById(commentId);
    const addReplyComment = await this._commentRepository.addReplyComment(payload);
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
