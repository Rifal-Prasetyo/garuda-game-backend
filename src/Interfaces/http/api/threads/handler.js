const AddCommentToThreadUseCase = require('../../../../Applications/use_case/AddCommentToThreadUseCase');
const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const DeleteCommentToThreadUseCase = require('../../../../Applications/use_case/DeleteCommentToThreadUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postAddCommentToThreadHandler = this.postAddCommentToThreadHandler.bind(this);
    this.deleteCommentToThreadHandler = this.deleteCommentToThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    this.addReplyCommentHandler = this.addReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials.id;
    const payload = {
      data: request.payload,
      credentialId,
    };
    const createdThread = await createThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: createdThread,
      },
    });
    response.code(201);
    return response;
  }

  async postAddCommentToThreadHandler(request, h) {
    const addCommentToThreadUseCase = this._container.getInstance(AddCommentToThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials.id;
    const { threadId } = request.params;
    const payload = {
      credentialId,
      threadId,
      data: {
        ...request.payload,
      },
    };
    const addedCommentToThread = await addCommentToThreadUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedCommentToThread,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentToThreadHandler(request) {
    const deleteCommentToThreadUseCase = this._container
      .getInstance(DeleteCommentToThreadUseCase.name);
    const { id: owner } = request.auth.credentials.id;
    const payload = {
      ...request.params,
      owner,
    };
    await deleteCommentToThreadUseCase.execute(payload);
    const response = {
      status: 'success',
    };
    return response;
  }

  async getDetailThreadHandler(request) {
    const detailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const detailThread = await detailThreadUseCase.execute(request.params);
    return {
      status: 'success',
      data: {
        thread: detailThread,
      },
    };
  }

  async addReplyCommentHandler(request, h) {
    const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials.id;

    const payload = {
      threadId,
      commentId,
      content,
      owner,
    };
    const addedReplyComment = await addReplyCommentUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        addedReply: addedReplyComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyCommentHandler(request) {
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);
    const { id: owner } = request.auth.credentials.id;
    const payload = {
      ...request.params,
      owner,
    };
    await deleteReplyCommentUseCase.execute(payload);

    const response = {
      status: 'success',
    };

    return response;
  }
}

module.exports = ThreadHandler;
