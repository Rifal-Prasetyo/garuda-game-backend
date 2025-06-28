const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthenticationError');

describe('DeleteReplyCommentUseCase', () => {
  it('should throw error when not contain property', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'o',
      commentId: 'ldkf',
    };
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({});

    // Action & Assert
    await expect(deleteReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow('DELETE_REPLY_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data spesification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 9876,
      commentId: true,
      replyId: ['string'],
    };
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({});

    // Action & Assert
    await expect(deleteReplyCommentUseCase.execute(useCasePayload)).rejects.toThrow('DELETE_REPLY_COMMENT_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should throw error when not found comment', async () => {
    const useCasePayload = {
      threadId: 'thread-97',
      commentId: 'comment-87',
      replyId: 'reply-sfhsf',
      owner: 'user-oksdfj',
    };

    // mocking needed repository
    const mockCommentRepository = new CommentRepository();
    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(deleteReplyCommentUseCase.execute(useCasePayload))
      .rejects.toThrow(NotFoundError);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.replyId);
  });
  it('should throw error when delete comment by another owner', async () => {
    const useCasePayload = {
      threadId: 'thread-97',
      commentId: 'comment-87',
      replyId: 'reply-123',
      owner: 'user-oksdfj',
    };

    // mocking needed repository
    const mockCommentRepository = new CommentRepository();
    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError()));

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(deleteReplyCommentUseCase.execute(useCasePayload))
      .rejects.toThrow(AuthorizationError);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
  });
  it('should orchestrating delete reply comment use case correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-fsjhfsf',
      commentId: 'comment-fkkjsfsf',
      replyId: 'reply-skjfksf',
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();

    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating instance use case
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
    expect(mockCommentRepository.deleteReplyComment)
      .toHaveBeenCalledWith({ id: useCasePayload.replyId, commentId: useCasePayload.commentId });
  });
});
