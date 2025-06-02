class DeleteCommentToThreadUseCase {
  constructor({
    commentRepository,
  }) {
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    const { threadId, commentId } = payload;
    await this.commentRepository.deleteCommentToThread({ threadId, commentId });
  }

  _validatePayload({ threadId, commentId }) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = DeleteCommentToThreadUseCase;
