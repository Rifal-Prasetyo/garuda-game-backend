const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-notfound',
      commentId: 'comment-notfound',
    };
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));

    // Action
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: {},
    });

    // Assert
    await expect(likeCommentUseCase.execute(payload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility).toHaveBeenCalledWith(payload.threadId);
  });
  it('should throw error when comment id not found', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-notfound',
      commentId: 'comment-notfound',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));

    // Action
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(likeCommentUseCase.execute(payload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.likeCommentById).toHaveBeenCalledWith(payload.commentId);
  });
  it('should success like comment', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-notfound',
      commentId: 'comment-notfound',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.likeCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(payload.commentId);
    expect(mockCommentRepository.likeCommentById).toHaveBeenCalledWith(payload.commentId, 'user-123');
  });
});
