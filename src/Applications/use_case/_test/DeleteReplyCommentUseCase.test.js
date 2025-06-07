const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');

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
    mockCommentRepository.deleteReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // creating instance use case
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteReplyComment).toHaveBeenCalled();
  });
});
