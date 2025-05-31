/* eslint-disable no-undef */
const AddCommentToThread = require('../AddCommentToThread');

describe('A AddCommentToThread entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddCommentToThread(payload)).toThrow('ADD_COMMENT_TO_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
    };

    // Action & Assert
    expect(() => new AddCommentToThread(payload)).toThrow('ADD_COMMENT_TO_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create AddCommentToThread entities correctly', () => {
    // Arrange
    const payload = {
      content: 'Izin tanya pada thread #12',
    };

    // Action
    const addCommentToThread = new AddCommentToThread(payload);

    // Assert
    expect(addCommentToThread).toBeInstanceOf(AddCommentToThread);
    expect(addCommentToThread.content).toEqual(payload.content);
  });
});
