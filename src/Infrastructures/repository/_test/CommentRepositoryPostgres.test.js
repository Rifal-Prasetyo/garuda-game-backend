const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddCommentToThread = require('../../../Domains/comments/entities/AddCommentToThread');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AddedCommentToThread = require('../../../Domains/comments/entities/AddedCommentToThread');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('addCommentToThread function', () => {
    it('should persists add comment to thread and return comment created correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blablabal' });
      const addCommentToThreadPayload = new AddCommentToThread({
        threadId: 'thread-blablabal',
        content: 'sebuah thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => 'nlanfakfkasf';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addCommentToThread = await commentRepositoryPostgres
        .addCommentToThread(addCommentToThreadPayload);
      // Assert
      expect(addCommentToThread).toStrictEqual(new AddedCommentToThread({
        id: `comment-${fakeIdGenerator()}`,
        content: 'sebuah thread',
        owner: 'user-123',
      }));
      const comment = await CommentTableTestHelper.findCommentById('comment-nlanfakfkasf');
      expect(comment).toHaveLength(1);
    });
  });
  describe('deleteCommentToThread function', () => {
    it('should not throw error when comment deleted correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blablablab' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-blablabla', threadId: 'thread-blablablab' });
      const deleteCommentToThreadPayload = {
        id: 'comment-blablabla',
        threadId: 'thread-blablablab',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentToThread(deleteCommentToThreadPayload))
        .resolves.not.toThrow();
    });
  });
  describe('addReplyComment function', () => {
    it('should persist add reply comment to thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-iougfhjhkk' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blblabald', owner: 'user-iougfhjhkk' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-blbabala', threadId: 'thread-blblabald', owner: 'user-iougfhjhkk' });
      const addReplyCommentPayload = {
        threadId: 'thread-blblabald',
        commentId: 'comment-blbabala',
        content: 'balasan comment',
        owner: 'user-iougfhjhkk',
      };
      const fakeIdGenerator = () => 'ljkhygcfvbn';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.addReplyComment(addReplyCommentPayload))
        .resolves.not.toThrow(NotFoundError);
      const replyComment = await CommentTableTestHelper.findCommentById('reply-ljkhygcfvbn');
      expect(replyComment).toHaveLength(1);
    });
  });
  describe('deleteReplyComment function', () => {
    it('should persist reply deleted correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-321' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-321', threadId: 'thread-321' });
      await CommentTableTestHelper.addCommentToThread({ id: 'reply-321', threadId: 'thread-321', commentId: 'comment-321' });
      const deleteReplyCommentPayload = {
        threadId: 'thread-321',
        commentId: 'comment-321',
        replyId: 'reply-321',
        owner: 'user-123',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres
        .deleteReplyComment({
          id: deleteReplyCommentPayload.threadId, commentId: deleteReplyCommentPayload.replyId,
        }))
        .resolves.not.toThrow(NotFoundError);
    });
  });
  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123' });
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & Assert
      await expect(commentRepositoryPostgres.getCommentById(commentId)).resolves.not.toThrow();
      const comment = await CommentTableTestHelper.findCommentById(commentId);
      expect(comment).toHaveLength(1);
    });
    it('should throw error when not found comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123' });
      const commentId = 'comment-not-found';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action & Assert
      await expect(commentRepositoryPostgres.getCommentById(commentId))
        .rejects.toThrow(NotFoundError);
      const comment = await CommentTableTestHelper.findCommentById(commentId);
      expect(comment).toHaveLength(0);
    });
  });
  describe('verifyCommentOwner function', () => {
    it('should not throw error if has comment with correct owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123')).resolves.not.toThrow();
    });
  });
});
