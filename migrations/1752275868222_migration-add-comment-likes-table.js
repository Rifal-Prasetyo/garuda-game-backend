/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('comment_likes', 'unique_comment_user_like', {
    unique: ['commentId', 'userId'],
  });
  pgm.addConstraint('comment_likes', 'fk_comments_likes.comment_id_comment_id', {
    foreignKeys: {
      columns: 'commentId',
      references: 'comments(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  pgm.addConstraint('comment_likes', 'fk_comments_likes.user_id_user_id', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'fk_comments_likes.comment_id_comment_id');
  pgm.dropConstraint('comment_likes', 'fk_comments_likes.user_id_user_id');
  pgm.dropTable('comment_likes');
};
