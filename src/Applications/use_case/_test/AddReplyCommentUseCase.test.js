const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReplyComment = require('../../../Domains/comments/entities/AddedReplyComment');

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

    //   creating dependency of use case
    const mockCommentRepository = new CommentRepository();

    // Mocking needed function
    mockCommentRepository.addReplyComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReplyComment));

    // creating use case instance
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const actualAddReplyCommentUseCase = await addReplyCommentUseCase.execute(useCasePayload);

    // Assert
    expect(actualAddReplyCommentUseCase).toStrictEqual(new AddedReplyComment({
      id: 'reply-ksjdfkdsf',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockCommentRepository.addReplyComment).toHaveBeenCalledWith(useCasePayload);
  });
});
