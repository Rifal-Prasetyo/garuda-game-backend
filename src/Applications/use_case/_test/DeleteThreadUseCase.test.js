const DeleteThreadUseCase = require('../DeleteThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteThreadUseCase', () => {
  it('should throw error when not meet data spesification', async () => {
    const useCasePayload = {
      threadId: true,
    };
    const deleteThreadUseCase = new DeleteThreadUseCase({});

    // Action & Assert
    await expect(deleteThreadUseCase.execute(useCasePayload)).rejects.toThrow('DELETE_THREAD.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should orchestrating delete thread use case correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-iuiyughvbnm',
    };

    // mocking dependency use case
    const mockThreadRepository = new ThreadRepository();

    // mocking function
    mockThreadRepository.deleteThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteThreadUseCase = new DeleteThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.deleteThread).toHaveBeenCalled();
  });
});
