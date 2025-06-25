const { nanoid } = require('nanoid');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      await expect(threadRepositoryPostgres.createThread(createThreadPayload)).resolves.not
        .toThrow(InvariantError);
    });
  });
  describe('getDetailThread function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const idThread = 'thread-opiouiyugvbnlkiouygh';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, nanoid);

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
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, nanoid);
      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread(idThread)).resolves.not
        .toThrow(NotFoundError);
    });
  });
});
