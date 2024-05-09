'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Chatrooms', {
      fields: ['sender_id', 'receiver_id'],
      type: 'unique',
      name: 'unique_sender_receiver_pair',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Chatrooms', 'unique_sender_receiver_pair');
  }
};
