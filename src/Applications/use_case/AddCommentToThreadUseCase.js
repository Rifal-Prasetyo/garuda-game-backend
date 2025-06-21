class AddCommentToThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._valdiatePayload(payload);
    const { credentialId: owner, threadId } = payload;
    const { content } = payload.data;
    await this._threadRepository.getDetailThread(threadId);
    const addCommentToThread = await this._commentRepository
      .addCommentToThread({ owner, threadId, content });
    return addCommentToThread;
  }

  _valdiatePayload(payload) {
    if (!payload.data) {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    const { content } = payload.data;
    const { credentialId, threadId } = payload;
    if (!content || !credentialId || !threadId) {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = AddCommentToThreadUseCase;
