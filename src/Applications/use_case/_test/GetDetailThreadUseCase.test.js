const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetDetailThreadUseCase', () => {
  it('should throw error when not meet data spesification', async () => {
    const useCasePayload = {
      threadId: 9876,
    };
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    await expect(getDetailThreadUseCase.execute(useCasePayload)).rejects.toThrow('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should orchestrating get detail thread use case correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-h_2FkLZhtgBKY2kh4CC02',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockDetailThread = new DetailThread({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-_pby2_tmXV6bcvcdev8xk',
              username: 'johndoe',
              date: new Date('2021-08-08T07:22:33.555Z'),
              content: 'sebuah comment',
            },
          ],
        },
      ],
    });

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const actualGetDetailThreadUseCase = await getDetailThreadUseCase.execute(useCasePayload);
    // Action & Assert
    expect(actualGetDetailThreadUseCase).toStrictEqual(mockDetailThread);
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
