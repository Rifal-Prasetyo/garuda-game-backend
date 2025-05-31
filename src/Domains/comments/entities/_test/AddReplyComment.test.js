const AddReplyComment = require('../AddReplyComment');

describe('AddReplyComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
    };

    // Action & Assert
    expect(() => new AddReplyComment(payload)).toThrow('ADD_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddReplyComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'menjadi pria sigma',
    };

    // Action
    const addReplyComment = new AddReplyComment(payload);

    // Assert
    expect(addReplyComment).toBeInstanceOf(AddReplyComment);
    expect(addReplyComment.content).toEqual(payload.content);
  });
});
