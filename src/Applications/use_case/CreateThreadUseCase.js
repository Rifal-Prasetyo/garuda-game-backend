const CreateThread = require('../../Domains/threads/entities/CreateThread');

class CreateThreadUseCase {
  constructor({ threadRepository, authenticationManager }) {
    this._threadRepository = threadRepository;
    this._authenticationManager = authenticationManager;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { accessToken } = useCasePayload;
    const { title, body } = useCasePayload.data;
    const { id } = await this._authenticationManager.decodePayload(accessToken);
    const createThread = new CreateThread({ title, body });
    createThread.owner = id;
    const createdThread = await this._threadRepository.createThread(createThread);
    return createdThread;
  }

  _validatePayload(payload) {
    const { accessToken } = payload;
    if (!accessToken) {
      throw new Error('CREATE_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }
    if (typeof accessToken !== 'string') {
      throw new Error('CREATE_THREAD_USE_CASE.ACCESS_TOKEN_NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
    const { title, body } = payload.data;
    if (!title || !body) {
      throw new Error('CREATE_THREAD_USE_CASE.NOT_CONTAIN_DATA');
    }
    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREAD_USE_CASE.DATA_NOT_MEET_DATA_SPESIFICATION');
    }
  }
}

module.exports = CreateThreadUseCase;
