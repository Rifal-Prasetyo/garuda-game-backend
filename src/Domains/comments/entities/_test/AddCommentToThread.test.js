const AddCommentToThread = require('../AddCommentToThread');

describe('AddCommentToThread entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: '',
    };

    // Action & Assert
    expect(() => new AddCommentToThread(payload)).toThrow('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should create AddCommentToThread entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-blafjkjadnfas',
      content: 'Izin menambahkan',
      owner: 'user-dksifjhjf',
    };

    // Action
    const addCommentToThread = new AddCommentToThread(payload);

    // Assert
    expect(addCommentToThread).toBeInstanceOf(AddCommentToThread);
    expect(Object.keys(addCommentToThread)).toEqual(['threadId', 'content', 'owner']);
    expect(addCommentToThread.threadId).toEqual(payload.threadId);
    expect(typeof addCommentToThread.threadId).toBe('string');
    expect(addCommentToThread.content).toEqual(payload.content);
    expect(typeof addCommentToThread.content).toBe('string');
    expect(addCommentToThread.owner).toEqual(payload.owner);
    expect(typeof addCommentToThread.owner).toBe('string');
    // Assert tidak ada properti lain selain yang diharapkan
    expect(Object.keys(addCommentToThread)).toEqual(['threadId', 'content', 'owner']);
  });
  it('should throw error when not meet data type spesification', () => {
    // Arrange
    const payload = {
      threadId: true,
      content: true,
      owner: true,
    };
    // Action & Assert
    expect(() => new AddCommentToThread(payload)).toThrow('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
