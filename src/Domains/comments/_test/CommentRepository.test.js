const CommentRepository = require('../CommentRepository');

it('should throw error when invoke abstract behavior', async () => {
  // Arrange
  const commentRepository = new CommentRepository();

  // Action & Assert
  await expect(commentRepository.addCommentToThread({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.deleteCommentToThread({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.addReplyComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.deleteReplyComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.getCommentById({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.verifyCommentOwner({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.getCommentsByThreadId({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  await expect(commentRepository.likeComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
});
