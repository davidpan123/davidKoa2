'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const {STRING, BIGINT} = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: STRING(50), primaryKey: true },
      name: STRING(30),
      password: STRING(200),
      createdAt: BIGINT,
      updatedAt: BIGINT,
      version: BIGINT
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('users');
  }
};
