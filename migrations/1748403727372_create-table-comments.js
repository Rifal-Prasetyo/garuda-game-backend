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
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
    },
    date: {
      type: 'DATE',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
    },
  });
  pgm.addConstraint('comments', 'fk_comments.owner_users_id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  });
  pgm.addConstraint('comments', 'fk_comments.commentId_comment_id', {
    foreignKeys: {
      columns: 'commentId',
      references: 'comments(id)',
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
  pgm.dropConstraint('comments', 'fk_comments.commentId_comment_id');
  pgm.dropConstraint('comments', 'fk_comments.owner_users_id');
  pgm.dropTable('comments');
};
