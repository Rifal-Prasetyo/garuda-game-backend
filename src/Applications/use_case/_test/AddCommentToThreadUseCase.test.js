const AddCommentToThreadUseCase = require('../AddCommentToThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedCommentToThread = require('../../../Domains/comments/entities/AddedCommentToThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('AddCommentToThreadUseCase', () => {
  it('should throw error when not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({});

    // Action & Assert
    await expect(addCommentToThreadUseCase.execute(useCasePayload)).rejects.toThrow('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: ['ya'],
      threadId: { key: 'value' },
      data: {
        content: true,
      },
    };
    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({});

    // Action & Assert
    await expect(addCommentToThreadUseCase.execute(useCasePayload)).rejects.toThrow('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should throw error when not found thread target', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-122',
      threadId: 'thread-122',
      data: {
        content: 'saya setuju',
      },
    };
    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAddedCommentToThread = new AddedCommentToThread({ id: 'comment-fisjfskf', content: useCasePayload.data.content, owner: 'user-122' });

    // mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    mockCommentRepository.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentToThread));

    // create use case instancce
    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentToThreadUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
  });
  it('should throw error when not contain needed property in data', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: ['ya'],
      threadId: { key: 'value' },
      data: {},
    };
    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({});

    // Action & Assert
    await expect(addCommentToThreadUseCase.execute(useCasePayload)).rejects.toThrow('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should orchestrating the add comment to thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      credentialId: 'user-122',
      threadId: 'thread-122',
      data: {
        content: 'saya setuju',
      },
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAddedCommentToThread = new AddedCommentToThread({ id: 'comment-fisjfskf', content: useCasePayload.data.content, owner: 'user-122' });

    // mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentToThread));

    // create use case instancce
    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualCommentToThreadUseCase = await addCommentToThreadUseCase.execute(useCasePayload);

    // Assert
    expect(actualCommentToThreadUseCase).toStrictEqual(new AddedCommentToThread({
      id: 'comment-fisjfskf',
      content: useCasePayload.data.content,
      owner: 'user-122',
    }));
    expect(mockThreadRepository.verifyThreadAvailibility(useCasePayload.threadId));
    expect(mockCommentRepository.addCommentToThread).toHaveBeenCalledWith({ ...useCasePayload.data, owner: 'user-122', threadId: useCasePayload.threadId });
  });
});
