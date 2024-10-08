'use strict';
const bcrypt = require("bcryptjs");
const {Spot} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}
console.log(Spot)
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.create(
      {
        address: "123",
        city: "test",
        state: "test",
        country: "test",
        lat: 123.1,
        lng: 123.1,
        name: "test",
        description: "test",
        price: 123.1,
        avgRating: 4.5,
        previewImage: "image"
      }
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';  
    await queryInterface.bulkDelete(options.tableName, null, options);
  }
};