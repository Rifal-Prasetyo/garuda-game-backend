const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddCommentToThread = require('../../../Domains/comments/entities/AddCommentToThread');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AddedCommentToThread = require('../../../Domains/comments/entities/AddedCommentToThread');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedReplyComment = require('../../../Domains/comments/entities/AddedReplyComment');

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
      const deleteCommentToThreadPayload = 'comment-blablabla';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await expect(commentRepositoryPostgres.deleteCommentToThread(deleteCommentToThreadPayload));

      // Assert
      const deletedComment = await CommentTableTestHelper.findCommentById('comment-blablabla');
      expect(deletedComment[0].is_delete).toEqual(true);
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

      // Action
      const addedReplyComment = await commentRepositoryPostgres
        .addReplyComment(addReplyCommentPayload);

      // Assert
      expect(addedReplyComment).toStrictEqual(new AddedReplyComment({
        id: 'reply-ljkhygcfvbn',
        content: 'balasan comment',
        owner: 'user-iougfhjhkk',
      }));
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
      await CommentTableTestHelper.addReplyToThread({ id: 'reply-321', threadId: 'thread-321', commentId: 'comment-321' });
      const deleteReplyCommentPayload = {
        threadId: 'thread-321',
        commentId: 'comment-321',
        replyId: 'reply-321',
        owner: 'user-123',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteReplyComment({
        id: deleteReplyCommentPayload.replyId, commentId: deleteReplyCommentPayload.commentId,
      });

      //  Assert
      const replyComment = await CommentTableTestHelper
        .findCommentById(deleteReplyCommentPayload.replyId);
      expect(replyComment[0].is_delete).toBe(true);
    });
  });
  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const date = new Date();
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123', date });
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // action
      const getCommentById = await commentRepositoryPostgres.getCommentById(commentId);

      //  & Assert
      expect(getCommentById).toEqual({
        id: 'comment-123',
        content: 'test comment',
        owner: 'user-123',
        date,
        commentId: null,
        threadId: 'thread-blbalbal',
        is_delete: null,
      });
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
    it('should throw error if not have comment with correct owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'other_user', fullname: 'rifal' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-124', 'comment-123')).rejects.toThrow(AuthorizationError);
    });
    it('should not throw error if has comment with correct owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123')).resolves.not.toThrow(AuthorizationError);
    });
  });
  describe('getCommentByThreadId  function', () => {
    it('should return comments using thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadTableTestHelper.createThread({ id: 'thread-blbalbal' });
      await CommentTableTestHelper.addCommentToThread({ threadId: 'thread-blbalbal' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-blbalbal');

      // Assert
      expect(comments.length).toEqual(1);
      expect(Array.isArray(comments)).toBe(true);
    });
  });
});
