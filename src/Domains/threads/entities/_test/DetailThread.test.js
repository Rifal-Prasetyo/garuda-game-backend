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
      owner: true,
      comments: [
        {
          id: true,
          owner: true,
          date: true,
          content: true,
        },
      ],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should detail thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'AI sangat mengerikan, bagaimana cara bertahan hidup',
      body: 'Sekarang hampir semua aspek menggunakan kecerdasan buatan, sangat menegerikan',
      date: new Date('2021-08-08T07:19:09.775Z'),
      owner: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          owner: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
        },
      ],
    };

    // Action
    const detailThead = new DetailThread(payload);
    // Assert
    expect(detailThead).toBeInstanceOf(DetailThread);
    expect(detailThead.id).toEqual(payload.id);
    expect(detailThead.title).toEqual(payload.title);
    expect(detailThead.body).toEqual(payload.body);
    expect(detailThead.date).toEqual(payload.date);
    expect(detailThead.owner).toEqual(payload.owner);
    expect(detailThead.title).toEqual(payload.title);
    expect(detailThead.comments).toEqual(payload.comments);
  });
});
