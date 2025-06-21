const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');

let accessToken;
let threadId;
let commentId;
let replyId;

describe('/threads endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    // add token for login
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const authentication = JSON.parse(response.payload);
    accessToken = authentication.data.accessToken;
  });

  afterAll(async () => {
    accessToken = undefined;
    threadId = undefined;
    commentId = undefined;
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should create threads correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        title: 'test thread',
        body: 'test body thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: '/threads',
        payload,
      });

      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(thread.status).toEqual('success');
      expect(thread.data.addedThread).toBeDefined();

      // set state threadId in global scope
      threadId = thread.data.addedThread.id;
    });
    it('should respone 401 when not contain bearer token', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        title: 'test thread',
        body: 'test body thread',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(thread.message).toBeDefined();
    });
    it('should response 400(Bad Request) when not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        title: 'test thread',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: '/threads',
        payload,
      });

      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(thread.status).toEqual('fail');
      expect(thread.message).toBeDefined();
    });
    it('should response 400(Bad Request) when not meet data type spesification', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        title: true,
        body: { key: 'value' },
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        url: '/threads',
        payload,
      });
      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(thread.status).toEqual('fail');
      expect(thread.message).toBeDefined();
    });
  });
  describe('when GET /threads', () => {
    it('should response 200(OK) when get thread correctly', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(thread.status).toEqual('success');
      expect(thread.data.thread).toBeDefined();
    });
    it('should response 404(Not Found) when not thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/lkjiuiytyfdgcvbn',
      });

      // Expect
      const thread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(thread.status).toEqual('fail');
      expect(thread.message).toBeDefined();
    });
  });
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 200(OK) when add comment to thread correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        content: 'test komentar',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(commentToThread.status).toEqual('success');
      expect(commentToThread.data.addedComment).toBeDefined();

      // set commandId global variable
      commentId = commentToThread.data.addedComment.id;
    });
    it('should response 401(Unauthorized) when not contain bearer token', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        content: 'test komentar',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          authorization: 'Bearer ngasal',
        },
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(commentToThread.message).toBeDefined();
    });
    it('should response 400(Bad Request) when not meet data type spesification', async () => {
      // Arrange
      const server = await createServer(container);
      const payload = {
        content: true,
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(commentToThread.status).toEqual('fail');
      expect(commentToThread.message).toBeDefined();
    });
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200(OK) when delete comment to thread correctly', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(commentToThread.status).toEqual('success');

      // set commentId global variabel
      commentId = undefined;
    });
    it('should response 401(Unauthorized) when not contain bearer token', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(commentToThread.message).toBeDefined();
    });
    it('should response 403(Forbidden) when trying to delete comment added by another user ', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-test', username: 'user-name' });
      await CommentTableTestHelper.addCommentToThread({ id: 'comment-test', threadId, owner: 'user-test' });
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${'comment-test'}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const commentToThread = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(commentToThread.status).toEqual('fail');
    });
  });
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 200(OK) when add reply comment to thread correctly', async () => {
      // Arrange
      const server = await createServer(container);
      /* add new comment */
      const responseAddcomment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'test komentar',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const addComment = JSON.parse(responseAddcomment.payload);
      /* set commandId Global variable */
      commentId = addComment.data.addedComment.id;

      /*  Payload  add reply comment */
      const payload = {
        content: 'test reply comment',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const addReplyComment = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(addReplyComment.status).toEqual('success');
      expect(addReplyComment.data.addedReply).toBeDefined();

      // set replyId global variabel
      replyId = addReplyComment.data.addedReply.id;
    });
    it('should response 401(Unauthorized) when not contain bearer token', async () => {
      // Arrange
      const server = await createServer(container);

      /*  Payload  add reply comment */
      const payload = {
        content: 'test reply comment',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
      });

      // Expect
      const addReplyComment = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(addReplyComment.message).toBeDefined();
    });
    it('should response 400(Bad Request) when not meet data type spesification', async () => {
      // Arrange
      const server = await createServer(container);

      /*  Payload  add reply comment */
      const payload = {
        content: true,
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const addReplyComment = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(addReplyComment.status).toEqual('fail');
      expect(addReplyComment.message).toBeDefined();
    });
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200(OK) when delete reply comment to thread correctly', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Expect
      const deleteReplyComment = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(deleteReplyComment.status).toEqual('success');
    });
    it('should response 401(Unauthorized) when not contain bearer token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Expect
      const deleteReplyComment = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(deleteReplyComment.message).toBeDefined();
    });
  });
});
