const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

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
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-124', threadId: 'thread-blbalabla', date: commnet2Date });
      await CommentTableTestHelper.addReplyToThread({
        id: 'reply-123', threadId: 'thread-blbalabla', commentId: 'comment-123', date: reply1Date,
      });
      await CommentTableTestHelper.addReplyToThread({
        id: 'reply-124', threadId: 'thread-blbalabla', commentId: 'comment-123', date: reply2Date,
      });
      const idThread = 'thread-blbalabla';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

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
          },
          {
            id: 'comment-124',
            username: 'dicoding',
            date: commnet2Date,
            content: 'test comment',
          },
          {
            id: 'reply-123',
            username: 'dicoding',
            date: reply1Date,
            content: 'test reply comment',
            commentId: 'comment-123',
          },
          {
            id: 'reply-124',
            username: 'dicoding',
            date: reply2Date,
            content: 'test reply comment',
            commentId: 'comment-123',
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
  });
});
