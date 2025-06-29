const AddReplyComment = require('../AddReplyComment');

describe('AddReplyComment entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: '',
    };

    // Action & Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data type spesification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-blafjkjadnfas',
      commentId: 'comment-kdsfjkfnsf',
      content: true,
      owner: 'user-dksifjhjf',
    };

    // Action & Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddReplyComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-blafjkjadnfas',
      commentId: 'comment-kdsfjkfnsf',
      content: 'Izin menambahkan',
      owner: 'user-dksifjhjf',
    };

    // Action
    const addReplyComment = new AddReplyComment(payload);

    // Assert
    expect(addReplyComment).toBeInstanceOf(AddReplyComment);
    expect(Object.keys(addReplyComment)).toEqual(['threadId', 'commentId', 'content', 'owner']);
    expect(addReplyComment.threadId).toEqual(payload.threadId);
    expect(typeof addReplyComment.threadId).toBe('string');
    expect(addReplyComment.commentId).toEqual(payload.commentId);
    expect(typeof addReplyComment.commentId).toBe('string');
    expect(addReplyComment.content).toEqual(payload.content);
    expect(typeof addReplyComment.content).toBe('string');
    expect(addReplyComment.owner).toEqual(payload.owner);
    expect(typeof addReplyComment.owner).toBe('string');
  });
});
