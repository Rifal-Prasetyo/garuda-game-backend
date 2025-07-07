const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetDetailThreadUseCase', () => {
  it('should throw error when not meet data spesification', async () => {
    const useCasePayload = {
      threadId: 9876,
    };
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    await expect(getDetailThreadUseCase.execute(useCasePayload)).rejects.toThrow('GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_SPESIFICATION');
  });
  it('should throw error when not found thread', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-blablabal',
    };

    //   creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    // creating use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(getDetailThreadUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
  });
  it('should orchestrating get detail thread use case correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-h_2FkLZhtgBKY2kh4CC02',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
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
        },
        {
          id: 'comment-_pby3_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment 2',
        },
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
          content: 'sebuah comment reply',
        },
      ],
    });

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailibility = jest.fn()
      .mockImplementation(() => Promise.resolve);
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date('2021-08-08T07:19:09.775Z'),
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
          commentId: null,
          is_delete: null,
        },
        {
          id: 'comment-_pby3_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment 2',
          commentId: null,
          is_delete: null,
        },
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment reply',
          commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
          is_delete: null,
        },
      ]));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const actualGetDetailThreadUseCase = await getDetailThreadUseCase.execute(useCasePayload);
    // Action & Assert
    expect(actualGetDetailThreadUseCase).toStrictEqual(mockDetailThread);
    expect(mockThreadRepository.verifyThreadAvailibility)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
