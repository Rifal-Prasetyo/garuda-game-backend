const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReplyComment = require('../../../Domains/comments/entities/AddedReplyComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('AddReplyCommentUseCase', () => {
  it('should throw error when not contain property', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'o',
    };
    const addReplyCommentUseCase = new AddReplyCommentUseCase({});

    // Action & Assert
    await expect(addReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow('ADD_REPLY_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 9876,
      commentId: true,
      content: 987,
      owner: ['string'],
    };
    const addReplyCommentUseCase = new AddReplyCommentUseCase({});

    // Action & Assert
    await expect(addReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow('ADD_REPLY_COMMENT_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should throw error when not found thread', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-blablabal',
      commentId: 'comment-ksjfndfs',
      content: 'mencoba membalas komentar',
      owner: 'user-ksdjfksndf',
    };

    //   creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    // creating use case instance
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
  });
  it('should throw error when invalid comment id', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-blablabal',
      commentId: 'comment-ksjfndfs',
      content: 'mencoba membalas komentar',
      owner: 'user-ksdjfksndf',
    };

    //   creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    // creating use case instance
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });
  it('should orchestrating add reply comment use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-blablabal',
      commentId: 'comment-ksjfndfs',
      content: 'mencoba membalas komentar',
      owner: 'user-ksdjfksndf',
    };
    const mockAddedReplyComment = new AddedReplyComment({
      id: 'reply-ksjdfkdsf',
      content: 'mencoba membalas komentar',
      owner: 'user-ksdjfksndf',
    });
    const mockGetCommentById = {
      id: 'comment-comment-ksjfndfs',
      content: 'test comment',
      owner: 'user-ksdjfksnd',
      date: new Date().setTime(1751173932000),
      commentId: null,
      threadId: 'thread-blablabal',
      is_delete: null,
    };
    //   creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetCommentById));
    mockCommentRepository.addReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReplyComment));

    // creating use case instance
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualAddReplyCommentUseCase = await addReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(actualAddReplyCommentUseCase).toStrictEqual(new AddedReplyComment({
      id: 'reply-ksjdfkdsf',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.addReplyComment).toHaveBeenCalledWith(useCasePayload);
  });
});
