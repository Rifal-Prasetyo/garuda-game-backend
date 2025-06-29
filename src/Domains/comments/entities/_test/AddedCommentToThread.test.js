const AddedCommentToThread = require('../AddedCommentToThread');

describe('AddedCommentToThread entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: '',
    };

    // Action & Assert
    expect(() => new AddedCommentToThread(payload)).toThrow('ADDED_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 'comment-blafjkjadnfas',
      content: true,
      owner: 'user-dksifjhjf',
    };

    // Action & Assert
    expect(() => new AddedCommentToThread(payload)).toThrow('ADDED_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddedCommentToThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-blafjkjadnfas',
      content: 'Izin menambahkan',
      owner: 'user-dksifjhjf',
    };

    // Action
    const addedCommentToThread = new AddedCommentToThread(payload);

    // Assert
    expect(addedCommentToThread).toBeInstanceOf(AddedCommentToThread);
    expect(Object.keys(addedCommentToThread)).toEqual(['id', 'content', 'owner']);
    expect(addedCommentToThread.id).toEqual(payload.id);
    expect(typeof addedCommentToThread.id).toBe('string');
    expect(addedCommentToThread.content).toEqual(payload.content);
    expect(typeof addedCommentToThread.content).toBe('string');
    expect(addedCommentToThread.owner).toEqual(payload.owner);
    expect(typeof addedCommentToThread.owner).toBe('string');
  });
});
