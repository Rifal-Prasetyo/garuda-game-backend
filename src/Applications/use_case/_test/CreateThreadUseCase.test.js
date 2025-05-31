const CreateThreadUseCase = require('../CreateThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

describe('CreateThreadUseCase', () => {
  it('should throw error if use case payload not contain access token', async () => {
    // Arrange
    const useCasePayload = {};
    const createThreadUseCase = new CreateThreadUseCase({});

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
  });
  it('should throw error if access token not string', async () => {
    // Arrange
    const useCasePayload = {
      accessToken: true,
    };
    const createThreadUseCase = new CreateThreadUseCase({});
    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.ACCESS_TOKEN_NOT_MEET_DATA_TYPE_SPESIFICATION');
  });
  it('should throw error if data not contain data', async () => {
    // Arrange
    const useCasePayload = {
      accessToken: 'access_token',
      data: {},
    };
    const createThreadUseCase = new CreateThreadUseCase({});

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.NOT_CONTAIN_DATA');
  });
  it('should throw error if data not meet data spesification', async () => {
    // Arrange
    const useCasePayload = {
      accessToken: 'access_token',
      data: {
        title: true,
        body: ['title'],
      },
    };
    const createThreadUseCase = new CreateThreadUseCase({});

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.DATA_NOT_MEET_DATA_SPESIFICATION');
  });
  it('should orchestrating the create thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      accessToken: 'accessToken',
      data: {
        title: 'Menjadi pria sigma',
        body: 'bagaimana cara menjadi pria sigma fanum tax level 99',
      },
    };
    //  creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockRegisteredUser = new CreatedThread({ id: 'thread-blabalbalbak', title: useCasePayload.data.title, owner: 'user-122' });

    // mocking needed function
    mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ username: 'rifal', id: 'user-122' }));
    mockThreadRepository.createThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    // create use case instance
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationManager: mockAuthenticationTokenManager,
    });

    // Action
    const actualCreateThread = await createThreadUseCase.execute(useCasePayload);
    // Assert
    expect(actualCreateThread).toStrictEqual(new CreatedThread({
      id: 'thread-blabalbalbak',
      title: useCasePayload.data.title,
      owner: 'user-122',
    }));
    expect(mockAuthenticationTokenManager.decodePayload)
      .toHaveBeenCalledWith(useCasePayload.accessToken);
    expect(mockThreadRepository.createThread).toHaveBeenCalledWith({ ...useCasePayload.data, owner: 'user-122' });
  });
});
