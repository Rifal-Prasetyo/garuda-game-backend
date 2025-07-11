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
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
  });
  pgm.addConstraint('comment_likes', 'fk_comments_likes.comment_id_comment_id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  });
  pgm.addConstraint('comment_likes', 'fk_comments_likes.user_id_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'SET NULL',
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
  pgm.dropTable('comment_likes');
  pgm.dropConstraint('comment_likes', 'fk_comments_likes.comment_id_comment_id');
  pgm.dropConstraint('comment_likes', 'fk_comments_likes.user_id_user_id');
};
