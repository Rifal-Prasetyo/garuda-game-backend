class DeleteThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    const { threadId } = payload;
    await this._threadRepository.deleteThread(threadId);
  }

  _validatePayload({ threadId }) {
    if (typeof threadId !== 'string') {
      throw new Error('DELETE_THREAD.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = DeleteThreadUseCase;
