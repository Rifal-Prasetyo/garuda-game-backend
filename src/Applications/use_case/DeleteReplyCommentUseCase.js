class DeleteReplyCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { commentId, owner, replyId } = payload;
    await this._commentRepository.getCommentById(replyId);
    await this._commentRepository.verifyCommentOwner(owner, replyId);
    await this._commentRepository.deleteReplyComment({ id: replyId, commentId });
  }

  _verifyPayload(payload) {
    const { threadId, commentId, replyId } = payload;
    if (!threadId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_COMMENT_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = DeleteReplyCommentUseCase;
