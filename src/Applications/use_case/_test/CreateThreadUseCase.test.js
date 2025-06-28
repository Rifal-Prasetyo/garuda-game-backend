const CreateThreadUseCase = require('../CreateThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

describe('CreateThreadUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const createThreadUseCase = new CreateThreadUseCase({});

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error if data not meet data spesification', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-122',
      data: {
        title: true,
        body: ['title'],
      },
    };
    const createThreadUseCase = new CreateThreadUseCase({});

    // Action & Assert
    await expect(createThreadUseCase.execute(useCasePayload)).rejects.toThrow('CREATE_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should orchestrating the create thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-122',
      data: {
        title: 'Menjadi pria sigma',
        body: 'bagaimana cara menjadi pria sigma fanum tax level 99',
      },
    };

    //  creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockRegisteredUser = new CreatedThread({ id: 'thread-blabalbalbak', title: useCasePayload.data.title, owner: 'user-122' });

    // mocking needed function
    mockThreadRepository.createThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    // create use case instance
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualCreateThread = await createThreadUseCase.execute(useCasePayload);
    // Assert
    expect(actualCreateThread).toStrictEqual(new CreatedThread({
      id: 'thread-blabalbalbak',
      title: useCasePayload.data.title,
      owner: 'user-122',
    }));
    expect(mockThreadRepository.createThread).toHaveBeenCalledWith({ ...useCasePayload.data, owner: 'user-122' });
  });
});
