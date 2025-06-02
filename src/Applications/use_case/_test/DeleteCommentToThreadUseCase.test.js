const DeleteCommentToThreadUseCase = require('../DeleteCommentToThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentAtThreadUseCase', () => {
  it('should throw error when not meet data spesification', async () => {
    const useCasePayload = {
      threadId: true,
      commentId: 9876,
    };
    const deleteCommentAtThreadUseCase = new DeleteCommentToThreadUseCase({});

    // Action
    await expect(deleteCommentAtThreadUseCase.execute(useCasePayload)).rejects.toThrow('DELETE_COMMENT_TO_THREAD.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should orchestrating delete comment at thread use case correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-kjuyghbjn',
      commentId: 'comment-isufygshf',
    };

    // mocking needed dependency
    const mockCommentRepository = new CommentRepository();

    // mocking function
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
    expect(mockCommentRepository.deleteCommentToThread).toHaveBeenCalled();
  });
});
