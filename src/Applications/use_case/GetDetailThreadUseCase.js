const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { threadId } = payload;
    await this._threadRepository.verifyThreadAvailibility(threadId);
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    return new DetailThread({ ...threadDetail, comments });
  }

  _verifyPayload(payload) {
    const { threadId } = payload;
    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = GetDetailThreadUseCase;
