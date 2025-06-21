class DeleteCommentToThreadUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    // try {
    this._validatePayload(payload);
    const { commentId, owner } = payload;
    await this._commentRepository.getCommentById(commentId);
    await this._commentRepository.verifyCommentOwner(owner, commentId);
    await this._commentRepository.deleteCommentToThread(commentId);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  _validatePayload({ threadId, commentId, owner }) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = DeleteCommentToThreadUseCase;
