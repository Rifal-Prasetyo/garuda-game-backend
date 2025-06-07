const CommentRepository = require('../CommentRepository');

it('should throw error when invoke abstract behavior', async () => {
  // Arrange
  const commentRepository = new CommentRepository();

  // Action & Assert
  await expect(commentRepository.addCommentToThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.deleteCommentToThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.addReplyComment({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.deleteReplyComment({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
});
