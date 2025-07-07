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
      const thread = await ThreadTableTestHelper.getThreadById('thread-1234');
      expect(thread).toHaveLength(1);
    });
  });
  describe('getDetailThread function', () => {
    it('should not throw error whwn thread found in database', async () => {
      function time(t) {
        const e = new Date();
        e.setTime(e.getTime() + t);
        return e;
      }
      const threadDate = time(100);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalabla', date: threadDate });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const actualThreadRepositoryPostgres = await threadRepositoryPostgres
        .getDetailThread('thread-blbalabla');
      //  & Assert
      expect(actualThreadRepositoryPostgres).toStrictEqual({
        id: 'thread-blbalabla',
        title: 'testing thread test',
        body: 'test thread',
        date: threadDate,
        username: 'dicoding',
      });
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
