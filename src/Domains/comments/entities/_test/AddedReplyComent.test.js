const AddedReplyComment = require('../AddedReplyComment');

describe('AddedReplyComment entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: '',
    };

    // Action & Assert
    expect(() => new AddedReplyComment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 'thread-blafjkjadnfas',
      content: true,
      owner: 'user-dksifjhjf',
    };

    // Action & Assert
    expect(() => new AddedReplyComment(payload)).toThrow('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddedReplyComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-blafjkjadnfas',
      content: 'Izin menambahkan',
      owner: 'user-dksifjhjf',
    };

    // Action
    const addedReplyComment = new AddedReplyComment(payload);

    // Assert
    expect(addedReplyComment).toBeInstanceOf(AddedReplyComment);
    expect(Object.keys(addedReplyComment)).toEqual(['id', 'content', 'owner']);
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(typeof addedReplyComment.id).toBe('string');
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(typeof addedReplyComment.content).toBe('string');
    expect(addedReplyComment.owner).toEqual(payload.owner);
    expect(typeof addedReplyComment.owner).toBe('string');
  });
});
