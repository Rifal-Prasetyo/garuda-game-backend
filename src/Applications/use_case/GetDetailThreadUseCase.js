class GetDetailThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this.threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { threadId } = payload;
    const threadDetail = await this.threadRepository.getDetailThread(threadId);
    return threadDetail;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;
    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = GetDetailThreadUseCase;
