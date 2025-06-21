const DeleteCommentToThreadUseCase = require('../DeleteCommentToThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('DeleteCommentAtThreadUseCase', () => {
  it('should throw error when not meet data spesification', async () => {
    const useCasePayload = {
      threadId: true,
      commentId: 9876,
      owner: true,
    };
    const deleteCommentAtThreadUseCase = new DeleteCommentToThreadUseCase({});

    // Action
    await expect(deleteCommentAtThreadUseCase.execute(useCasePayload)).rejects.toThrow('DELETE_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should throw error when not found comment', async () => {
    const useCasePayload = {
      threadId: 'thread-97',
      commentId: 'comment-87',
      owner: 'user-oksdfj',
    };

    // mocking needed repository
    const mockCommentRepository = new CommentRepository();
    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));

    const deleteCommentAtThreadUseCase = new DeleteCommentToThreadUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(deleteCommentAtThreadUseCase.execute(useCasePayload))
      .rejects.toThrow(NotFoundError);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });
  it('should throw error when delete comment by another owner', async () => {
    const useCasePayload = {
      threadId: 'thread-97',
      commentId: 'comment-87',
      owner: 'user-oksdfj',
    };

    // mocking needed repository
    const mockCommentRepository = new CommentRepository();
    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError()));

    const deleteCommentAtThreadUseCase = new DeleteCommentToThreadUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(deleteCommentAtThreadUseCase.execute(useCasePayload))
      .rejects.toThrow(AuthorizationError);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalled();
  });
  it('should orchestrating delete comment at thread use case correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-kjuyghbjn',
      commentId: 'comment-isufygshf',
      owner: 'user-blabalba',
    };

    // mocking needed dependency
    const mockCommentRepository = new CommentRepository();

    // mocking function
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteCommentToThreadUseCase = new DeleteCommentToThreadUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentToThreadUseCase
      .execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalled();
    expect(mockCommentRepository.deleteCommentToThread).toHaveBeenCalled();
  });
});
