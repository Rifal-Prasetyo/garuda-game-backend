const CreateThread = require('../../Domains/threads/entities/CreateThread');

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { title, body } = useCasePayload.data;
    const { credentialId: id } = useCasePayload;
    const createThread = new CreateThread({ title, body });
    createThread.owner = id;
    const createdThread = await this._threadRepository.createThread(createThread);
    return createdThread;
  }

  _validatePayload(payload) {
    if (!payload.data) {
      throw new Error('CREATE_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    const { title, body } = payload.data;
    if (!title || !body) {
      throw new Error('CREATE_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = CreateThreadUseCase;
