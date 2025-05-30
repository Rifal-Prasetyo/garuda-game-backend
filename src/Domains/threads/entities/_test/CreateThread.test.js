/* eslint-disable no-undef */
const CreateThread = require('../CreateThread');

describe('CreateThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'mengapa kenapa',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrow('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: true,
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrow('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create thread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'AI sangat mengerikan, bagaimana cara bertahan hidup',
      body: 'Sekarang hampir semua aspek menggunakan kecerdasan buatan, sangat menegerikan',
    };

    // Action
    const createThread = new CreateThread(payload);
    // Assert
    expect(createThread).toBeInstanceOf(CreateThread);
    expect(createThread.title).toEqual(payload.title);
    expect(createThread.body).toEqual(payload.body);
  });
});
