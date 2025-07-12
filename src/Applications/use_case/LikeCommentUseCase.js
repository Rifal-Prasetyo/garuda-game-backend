class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    await this._threadRepository.verifyThreadAvailibility(payload.threadId);
    await this._commentRepository.getCommentById(payload.commentId);
    await this._commentRepository.likeComment(payload.commentId, payload.userId);
  }

  _validatePayload({ threadId, commentId, userId }) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
