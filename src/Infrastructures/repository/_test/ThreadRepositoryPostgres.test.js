const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should not throw error when thread succesfully created', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-122', username: 'rifal-ganteng', fullname: 'Rifaru' });
      const createThreadPayload = {
        title: 'Thread test',
        body: 'isi body dari thread',
        owner: 'user-122',
      };
      const fakeIdGenerator = () => '1234';
      const createdThread = new CreatedThread({
        id: `thread-${fakeIdGenerator()}`,
        title: createThreadPayload.title,
        owner: createThreadPayload.owner,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      const threadRepositoryPostgresResult = await threadRepositoryPostgres
        .createThread(createThreadPayload);
      expect(threadRepositoryPostgresResult).toStrictEqual(createdThread);
      const thread = await ThreadTableTestHelper.getThreadById('thread-1234');
      expect(thread).toHaveLength(1);
    });
  });
  describe('getDetailThread function', () => {
    it('should not throw error whwn thread found in database', async () => {
      // Arrange
      function time(t) {
        const e = new Date();
        e.setTime(e.getTime() + t);
        return e;
      }
      const threadDate = time(100);
      const comment1Date = time(200);
      const commnet2Date = time(300);
      const reply1Date = time(400);
      const reply2Date = time(500);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalabla', date: threadDate });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123', threadId: 'thread-blbalabla', date: comment1Date });
      await CommentTableTestHelper.addCommentToThread({
        id: 'comment-124', threadId: 'thread-blbalabla', date: commnet2Date, isDelete: true,
      });
      await CommentTableTestHelper.addReplyToThread({
        id: 'reply-123', threadId: 'thread-blbalabla', commentId: 'comment-123', date: reply1Date, isDelete: true,
      });
      await CommentTableTestHelper.addReplyToThread({
        id: 'reply-124', threadId: 'thread-blbalabla', commentId: 'comment-123', date: reply2Date,
      });
      const idThread = 'thread-blbalabla';

      // mocking use case
      const mockComments = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: comment1Date,
          content: 'test comment',
          commentId: null,
          is_delete: false,
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: commnet2Date,
          content: 'test comment',
          commentId: null,
          is_delete: true,
        },
        {
          id: 'reply-123',
          username: 'dicoding',
          date: reply1Date,
          content: 'test reply comment',
          commentId: 'comment-123',
          is_delete: true,
        },
        {
          id: 'reply-124',
          username: 'dicoding',
          date: reply2Date,
          content: 'test reply comment',
          commentId: 'comment-123',
          is_delete: false,
        },
      ];
      const mockCommentRepository = new CommentRepository();

      // mocking needed function
      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockComments));

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        {},
        mockCommentRepository,
      );

      // Action
      const actualThreadRepositoryPostgres = await threadRepositoryPostgres
        .getDetailThread(idThread);
      //  & Assert
      expect(actualThreadRepositoryPostgres).toStrictEqual(new DetailThread({
        id: 'thread-blbalabla',
        title: 'testing thread test',
        body: 'test thread',
        date: threadDate,
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: comment1Date,
            content: 'test comment',
            commentId: null,
            is_delete: false,
          },
          {
            id: 'comment-124',
            username: 'dicoding',
            date: commnet2Date,
            content: 'test comment',
            commentId: null,
            is_delete: true,
          },
          {
            id: 'reply-123',
            username: 'dicoding',
            date: reply1Date,
            content: 'test reply comment',
            commentId: 'comment-123',
            is_delete: true,
          },
          {
            id: 'reply-124',
            username: 'dicoding',
            date: reply2Date,
            content: 'test reply comment',
            commentId: 'comment-123',
            is_delete: false,
          },
        ],
      }));
      const thread = await ThreadTableTestHelper.getThreadById('thread-blbalabla');
      expect(thread).toHaveLength(1);
    });
  });
  describe('verifyThreadAvailability, function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const idThread = 'thread-opiouiyugvbnlkiouygh';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailibility(idThread)).rejects
        .toThrow(NotFoundError);
    });
    it('should not throw error when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234' });
      await ThreadTableTestHelper.createThread({ id: 'thread-1234', owner: 'user-1234' });
      const idThread = 'thread-1234';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailibility(idThread)).resolves.not
        .toThrow(NotFoundError);
    });
  });
});
