const AddedCommentToThread = require('../AddedCommentToThread');

describe('AddedCommentToThread', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddedCommentToThread(payload)).toThrow('ADDED_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: ['yukata'],
      owner: { name: 'john-doe' },
    };

    // Action & Assert
    expect(() => new AddedCommentToThread(payload)).toThrow('ADDED_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddedCommentToThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-kugvbnnjjhvgh ',
      content: 'menjadi pria sigma',
      owner: 'user-122',
    };

    // Action
    const addedCommentToThread = new AddedCommentToThread(payload);

    // Assert
    expect(addedCommentToThread).toBeInstanceOf(AddedCommentToThread);
    expect(addedCommentToThread.id).toEqual(payload.id);
    expect(addedCommentToThread.content).toEqual(payload.content);
    expect(addedCommentToThread.owner).toEqual(payload.owner);
  });
});
