class DeleteReplyCommentUseCase {
  constructor({ commentRepository }) {
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    await this.commentRepository.deleteReplyComment(payload);
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
