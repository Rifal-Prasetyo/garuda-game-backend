const CreatedThread = require('../CreatedThread');

describe('CreatedThread entity', () => {
  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrow('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: [],
      owner: {},
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrow('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should created thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-9jiu',
      title: 'AI sangat mengerikan, bagaimana cara bertahan hidup',
      owner: 'user-kjjskf',
    };

    // Action
    const createdThread = new CreatedThread(payload);
    // Assert
    expect(createdThread).toBeInstanceOf(CreatedThread);
    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});
