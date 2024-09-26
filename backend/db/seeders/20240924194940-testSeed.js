'use strict';

const { Spot } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        address: 'testSpot1',
        city: 'testSpot1',
        state: 'testSpot1',
        country: 'testSpot1',
        name: 'testSpot1',
        description: 'testSpot1',
        lat: 12,
        lng: 12,
        price: 12,
      },
      {
        address: 'testSpot2',
        city: 'testSpot2',
        state: 'testSpot2',
        country: 'testSpot2',
        name: 'testSpot2',
        description: 'testSpot2',
        lat: 12,
        lng: 12,
        price: 12,
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
