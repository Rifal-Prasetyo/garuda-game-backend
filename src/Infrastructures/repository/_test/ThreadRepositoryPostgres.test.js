const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

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
    });
  });
  describe('getDetailThread function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const idThread = 'thread-opiouiyugvbnlkiouygh';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread(idThread)).rejects
        .toThrow(NotFoundError);
    });
    it('should not throw error whwn thread found in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalabla' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123', threadId: 'thread-blbalabla' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-124', threadId: 'thread-blbalabla' });
      await CommentTableTestHelper.addReplyToThread({ id: 'reply-123', threadId: 'thread-blbalabla', commentId: 'comment-123' });
      await CommentTableTestHelper.addReplyToThread({ id: 'reply-124', threadId: 'thread-blbalabla', commentId: 'comment-123' });
      const idThread = 'thread-blbalabla';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread(idThread)).resolves.not
        .toThrow(NotFoundError);
      const thread = await ThreadTableTestHelper.getThreadById('thread-blbalabla');
      expect(thread).toHaveLength(1);
    });
  });
});
