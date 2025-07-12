const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
  it('should throw when not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'ini saja',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: true,
      body: true,
      date: true,
      username: true,
      comments: [
        {
          id: true,
          username: true,
          date: true,
          content: true,
          likeCount: true,
        },
      ],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create DetailThread with correct property types', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi thread',
      date: new Date('2022-01-01T00:00:00.000Z'),
      username: 'user1',
      comments: [
        {
          id: 'comment-1',
          username: 'user2',
          date: new Date('2022-01-01T01:00:00.000Z'),
          content: 'Komentar pertama',
          is_delete: false,
          likeCount: 1,
        },
        {
          id: 'comment-2',
          username: 'user2',
          date: new Date('2022-01-01T01:00:00.000Z'),
          content: 'Komentar kedua',
          is_delete: false,
          likeCount: 2,
        },
        {
          id: 'reply-1',
          username: 'user3',
          date: new Date('2022-01-01T01:10:00.000Z'),
          content: 'Balasan komentar 1',
          commentId: 'comment-1',
          is_delete: false,
          likeCount: 3,
        },
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toBe(payload.id);
    expect(typeof detailThread.id).toBe('string');
    expect(detailThread.title).toBe(payload.title);
    expect(typeof detailThread.title).toBe('string');
    expect(detailThread.body).toBe(payload.body);
    expect(typeof detailThread.body).toBe('string');
    expect(detailThread.date).toBeInstanceOf(Date);
    expect(detailThread.username).toBe(payload.username);
    expect(typeof detailThread.username).toBe('string');
    expect(Array.isArray(detailThread.comments)).toBe(true);
    expect(detailThread.comments.length).toBe(2);
    const comment1 = detailThread.comments[0];
    expect(comment1.id).toBe('comment-1');
    expect(typeof comment1.id).toBe('string');
    expect(comment1.username).toBe('user2');
    expect(typeof comment1.username).toBe('string');
    expect(comment1.date).toBeInstanceOf(Date);
    expect(comment1.content).toBe('Komentar pertama');
    expect(typeof comment1.content).toBe('string');
    expect(comment1.likeCount).toBe(1);
    expect(typeof comment1.likeCount).toBe('number');
    expect(Array.isArray(comment1.replies)).toBe(true);
    expect(comment1.replies.length).toBe(1);
    const comment2 = detailThread.comments[1];
    expect(comment2.id).toBe('comment-2');
    expect(typeof comment2.id).toBe('string');
    expect(comment2.username).toBe('user2');
    expect(typeof comment2.username).toBe('string');
    expect(comment2.date).toBeInstanceOf(Date);
    expect(comment2.content).toBe('Komentar kedua');
    expect(typeof comment2.content).toBe('string');
    expect(comment2.likeCount).toBe(2);
    expect(typeof comment2.likeCount).toBe('number');
    expect(Array.isArray(comment2.replies)).toBe(true);
    expect(comment2.replies.length).toEqual(0);
    const reply = comment1.replies[0];
    expect(reply.id).toBe('reply-1');
    expect(typeof reply.id).toBe('string');
    expect(reply.username).toBe('user3');
    expect(typeof reply.username).toBe('string');
    expect(reply.date).toBeInstanceOf(Date);
    expect(reply.content).toBe('Balasan komentar 1');
    expect(typeof reply.content).toBe('string');
    expect(reply.commentId).toBeUndefined();
    expect(reply.is_delete).toBeUndefined();
  });

  it('should replace deleted comment and reply content with proper message', () => {
    // Arrange
    const payload = {
      id: 'thread-456',
      title: 'Thread Dihapus',
      body: 'Isi thread dihapus',
      date: new Date('2022-02-02T00:00:00.000Z'),
      username: 'user4',
      comments: [
        {
          id: 'comment-del',
          username: 'user5',
          date: new Date('2022-02-02T01:00:00.000Z'),
          content: 'Komentar yang dihapus',
          is_delete: true,
          likeCount: 1,
        },
        {
          id: 'reply-del',
          username: 'user6',
          date: new Date('2022-02-02T01:10:00.000Z'),
          content: 'Balasan yang dihapus',
          commentId: 'comment-del',
          is_delete: true,
          likeCount: 2,
        },
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments.length).toBe(1);
    const comment = detailThread.comments[0];
    expect(comment.content).toBe('**komentar telah dihapus**');
    expect(comment.is_delete).toBeUndefined();
    expect(Array.isArray(comment.replies)).toBe(true);
    expect(comment.replies.length).toBe(1);

    const reply = comment.replies[0];
    expect(reply.content).toBe('**balasan telah dihapus**');
    expect(reply.is_delete).toBeUndefined();
  });

  it('should handle empty comments array', () => {
    // Arrange
    const payload = {
      id: 'thread-789',
      title: 'Thread Kosong',
      body: 'Tidak ada komentar',
      date: new Date('2022-03-03T00:00:00.000Z'),
      username: 'user7',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.comments).toEqual([]);
    expect(Array.isArray(detailThread.comments)).toBe(true);
  });
});
