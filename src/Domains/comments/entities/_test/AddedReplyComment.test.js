const AddedReplyComment = require('../AddedReplyComment');

describe('AddedReplyComment', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddedReplyComment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: ['yukata'],
      owner: { name: 'john-doe' },
    };

    // Action & Assert
    expect(() => new AddedReplyComment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddedReplyComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-kugvbnnjjhvgh ',
      content: 'menjadi pria sigma',
      owner: 'user-123',
    };

    // Action
    const addedReplyComment = new AddedReplyComment(payload);

    // Assert
    expect(addedReplyComment).toBeInstanceOf(AddedReplyComment);
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(addedReplyComment.owner).toEqual(payload.owner);
  });
});
