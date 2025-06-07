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
    expect(addReplyComment.threadId).toEqual(payload.threadId);
    expect(addReplyComment.commentId).toEqual(payload.commentId);
    expect(addReplyComment.content).toEqual(payload.content);
    expect(addReplyComment.owner).toEqual(payload.owner);
  });
});
