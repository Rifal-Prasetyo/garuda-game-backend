class CommentRepository {
  async addCommentToThread() {
<<<<<<< Updated upstream
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentToThread() {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReplyComment() {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyComment() {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
=======
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentToThread() {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReplyComment() {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyComment() {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
>>>>>>> Stashed changes
  }
}

module.exports = CommentRepository;
